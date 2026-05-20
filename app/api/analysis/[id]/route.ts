import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: analysisId } = await params;

  const analysis = await prisma.healthAnalysis.findUnique({
    where: { id: analysisId },
    include: {
      vehicle: {
        include: {
          images: true,
        },
      },
      notes: true,
    },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
  }

  const detections = await prisma.aiDetection.findMany({
    where: { vehicleId: analysis.vehicleId },
    orderBy: { createdAt: "desc" },
  });

  const visibleIssues = detections.filter((item) => !item.hidden).slice(0, 10);
  const hiddenCount = detections.filter((item) => item.hidden).length;

  return NextResponse.json({
    analysis,
    vehicle: analysis.vehicle,
    visibleIssues,
    hiddenCount,
    notes: analysis.notes,
  });
}
