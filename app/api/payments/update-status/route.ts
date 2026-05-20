import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { vehicleId, status } = await request.json();

  if (!vehicleId || !status) {
    return NextResponse.json(
      { error: "Missing vehicleId or status" },
      { status: 400 },
    );
  }

  try {
    // Update the payment status (for guest users, find by vehicleId and pending status)
    const payment = await prisma.payment.updateMany({
      where: {
        vehicleId,
        status: "Pending",
      },
      data: {
        status,
      },
    });

    if (payment.count === 0) {
      return NextResponse.json(
        { error: "No pending payment found" },
        { status: 404 },
      );
    }

    // Update vehicle analysis status if payment completed
    if (status === "Completed") {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { analysisStatus: "Completed" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment status update error:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 },
    );
  }
}