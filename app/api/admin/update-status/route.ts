import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user?.id || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { analysisId, status, paymentId, paymentStatus } = await request.json();

  if (analysisId && status) {
    const updated = await prisma.healthAnalysis.update({
      where: { id: analysisId },
      data: { analysisStatus: status },
    });

    if (status === "Delivered") {
      await prisma.vehicle.update({
        where: { id: updated.vehicleId },
        data: { analysisStatus: "Delivered" },
      });
    }

    return NextResponse.json({ analysis: updated });
  }

  if (paymentId && paymentStatus) {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: paymentStatus },
    });
    return NextResponse.json({ payment });
  }

  return NextResponse.json({ error: "Missing update payload." }, { status: 400 });
}
