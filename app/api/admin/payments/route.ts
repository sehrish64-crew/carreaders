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

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      vehicle: true,
    },
  });

  return NextResponse.json({ payments });
}
