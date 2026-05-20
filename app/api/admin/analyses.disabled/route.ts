// Temporarily disabled to unblock production build
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ error: "This route is temporarily disabled for build." }, { status: 503 });
}
