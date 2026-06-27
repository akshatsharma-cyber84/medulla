/* ────────────────────────────────────────────────────────
 * MEDULLA AI – SESSIONS API
 * Handles chat session listing, creation, deletion
 * ──────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chatSessions, messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/* GET: List all sessions for a user */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ sessions: [] });
    }

    const sessions = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, parseInt(userId)))
      .orderBy(desc(chatSessions.updatedAt));

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Sessions error:", error);
    return NextResponse.json({ sessions: [] });
  }
}

/* POST: Create a new session */
export async function POST(req: NextRequest) {
  try {
    const { userId, title } = await req.json();

    const newSession = await db
      .insert(chatSessions)
      .values({
        userId: userId || null,
        title: title || "New Chat",
      })
      .returning();

    return NextResponse.json({ session: newSession[0] });
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

/* DELETE: Delete a session and its messages */
export async function DELETE(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    const sid = parseInt(sessionId);

    // Delete messages first, then session
    await db.delete(messages).where(eq(messages.sessionId, sid));
    await db.delete(chatSessions).where(eq(chatSessions.id, sid));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
