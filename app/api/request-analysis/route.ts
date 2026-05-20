import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/utils/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // No authentication required - users can purchase without signing in

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
  const limit = rateLimit(ip, 20, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfter: limit.resetAt },
      { status: 429 },
    );
  }

  const { customerName, customerEmail, selectedPlan, vehicleId } = await request.json();

  if (!customerName || !customerEmail || !selectedPlan || !vehicleId) {
    return NextResponse.json(
      { error: "Missing required request-analysis fields." },
      { status: 400 },
    );
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
  }

  const guestUserId = "guest-user";
  const guestUserEmail = "guest@motorpulse.local";

  await prisma.user.upsert({
    where: { email: guestUserEmail },
    update: {},
    create: {
      id: guestUserId,
      email: guestUserEmail,
      password: "guest-password",
      role: "GUEST",
    },
  });

  const payment = await prisma.payment.create({
    data: {
      userId: guestUserId,
      vehicleId,
      customerName,
      customerEmail,
      selectedPlan,
      status: "Pending",
    },
  });

  return NextResponse.json({ payment });
}
