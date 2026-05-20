import { NextResponse } from "next/server";
import { createId, query } from "@/lib/db";

export const runtime = "nodejs";

console.log('/api/contact initialized', {
  DATABASE_URL: process.env.DATABASE_URL,
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    if (!firstName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "firstName, email, subject, and message are required." },
        { status: 400 }
      );
    }

    const contactId = createId();

    await query(
      "INSERT INTO `contact_messages` (`id`, `firstName`, `lastName`, `email`, `subject`, `message`, `createdAt`) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [contactId, firstName, lastName || "", email, subject, message]
    );

    return NextResponse.json({ success: true, id: contactId });
  } catch (error: any) {
    console.error("/api/contact error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Unknown contact submission error." },
      { status: 500 }
    );
  }
}
