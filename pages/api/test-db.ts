import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rows = await query("SELECT 1 + 1 AS result");
    const result = rows?.[0]?.result ?? null;

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Database query error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Database query failed",
    });
  }
}
