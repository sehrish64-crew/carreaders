import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user?.id || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const recentAnalyses = await prisma.healthAnalysis.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { vehicle: true },
  });

  const recentPayments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { user: true, vehicle: true },
  });

  return NextResponse.json({
    liveAnalyses: recentAnalyses,
    recentPayments,
  });
}
