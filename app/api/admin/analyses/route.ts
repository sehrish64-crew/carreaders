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

  const [totalAnalyses, activeAnalyses, pendingPayments, deliveredAnalyses] = await Promise.all([
    prisma.healthAnalysis.count(),
    prisma.healthAnalysis.count({ where: { analysisStatus: "Processing" } }),
    prisma.payment.count({ where: { status: "Pending" } }),
    prisma.healthAnalysis.count({ where: { analysisStatus: "Delivered" } }),
  ]);

  const latestAnalyses = await prisma.healthAnalysis.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      vehicle: true,
    },
  });

  return NextResponse.json({
    totalAnalyses,
    activeAnalyses,
    pendingPayments,
    deliveredAnalyses,
    latestAnalyses,
  });
}
