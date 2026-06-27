/* ────────────────────────────────────────────────────────
 * MEDULLA AI – MESSAGES API
 * Fetch messages for a specific chat session
 * ──────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ messages: [] });
    }

    const sessionMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, parseInt(sessionId)))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({ messages: sessionMessages });
  } catch (error) {
    console.error("Messages error:", error);
    return NextResponse.json({ messages: [] });
  }
}
