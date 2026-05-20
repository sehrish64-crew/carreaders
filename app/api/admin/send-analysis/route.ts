import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateFullAnalysisPdf } from "@/services/analysis";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user?.id || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { analysisId } = await request.json();
  if (!analysisId) {
    return NextResponse.json({ error: "Missing analysisId." }, { status: 400 });
  }

  const pdfUrl = await generateFullAnalysisPdf(analysisId);
  return NextResponse.json({ pdfUrl });
}
