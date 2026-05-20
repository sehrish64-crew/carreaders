import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitRealtimeEvent } from "@/lib/socket";
import { rateLimit } from "@/utils/rate-limit";
import { runAiAnalysis } from "@/services/ai";
import { createHealthAnalysis } from "@/services/analysis";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // For development/testing, allow analysis without authentication
    // TODO: Remove this in production
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    // Use test user if not authenticated
    let userId = user?.id;
    if (!userId) {
      const testUser = await prisma.user.upsert({
        where: { email: "test@example.com" },
        update: {},
        create: {
          email: "test@example.com",
          name: "Test User",
          password: "hashedpassword",
          role: "USER",
        },
      });
      userId = testUser.id;
    }

    const ip = request.headers.get("x-forwarded-for") || userId;
    const limit = rateLimit(ip, 20, 60);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: limit.resetAt },
        { status: 429 },
      );
    }

    const { vehicleId } = await request.json();
    if (!vehicleId) {
      return NextResponse.json({ error: "Missing vehicleId." }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { images: true },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    emitRealtimeEvent("ai_processing_started", { vehicleId });

    const imageUrls = (vehicle.images as any[]).map((image) => image.imageUrl);
    const aiResult = await runAiAnalysis(imageUrls);

    emitRealtimeEvent("analysis_progress", { vehicleId, progress: 25 });

    aiResult.issues.forEach((issue, index) => {
      setTimeout(() => {
        emitRealtimeEvent("issue_detected", {
          id: issue.id,
          title: issue.title,
          severity: issue.severity,
          confidence: issue.confidence,
          location: "Vehicle exterior",
          description: issue.description,
          repairEstimate: issue.repairEstimate,
        });
        emitRealtimeEvent("analysis_progress", {
          vehicleId,
          progress: aiResult.issues.length
            ? 25 + Math.floor(((index + 1) / aiResult.issues.length) * 50)
            : 50,
        });
      }, (index + 1) * 500);
    });

    emitRealtimeEvent("analysis_progress", { vehicleId, progress: 75 });

    const analysis = await createHealthAnalysis(vehicleId, aiResult);

    emitRealtimeEvent("analysis_generation_started", { analysisId: analysis.id });
    emitRealtimeEvent("analysis_progress", { vehicleId, progress: 90 });

    const visibleIssues = aiResult.issues.filter((issue) => !issue.hidden).slice(0, 10);
    const hiddenCount = aiResult.issues.filter((issue) => issue.hidden).length;

    emitRealtimeEvent("analysis_complete", { vehicleId, analysisId: analysis.id });
    emitRealtimeEvent("analysis_progress", { vehicleId, progress: 100 });

    return NextResponse.json({
      analysisId: analysis.id,
      score: aiResult.score ?? aiResult.conditionScore,
      issues: aiResult.issues,
      raw_predictions: aiResult.rawPredictions ?? [],
      conditionScore: aiResult.conditionScore,
      riskLevel: aiResult.riskLevel,
      visibleIssues,
      hiddenCount,
    });
  } catch (error: any) {
    console.error("/api/analyze error:", error);
    const message = error?.message ?? "Unknown analysis error.";
    const status = message.includes("403") || message.includes("Forbidden")
      ? 502
      : message.includes("405")
      ? 502
      : message.includes("Network error")
      ? 502
      : 500;

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}
