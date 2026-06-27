/* ────────────────────────────────────────────────────────
 * MEDULLA AI – MEMORY API
 * Store and retrieve user preferences, interests, contexts
 * ──────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { memories } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/* GET: Retrieve memories for a user */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ memories: [] });
    }

    const userMemories = await db
      .select()
      .from(memories)
      .where(eq(memories.userId, parseInt(userId)));

    return NextResponse.json({ memories: userMemories });
  } catch (error) {
    console.error("Memory fetch error:", error);
    return NextResponse.json({ memories: [] });
  }
}

/* POST: Store a new memory */
export async function POST(req: NextRequest) {
  try {
    const { userId, category, key, value, metadata } = await req.json();

    if (!userId || !category || !key || !value) {
      return NextResponse.json(
        { error: "userId, category, key, and value are required" },
        { status: 400 }
      );
    }

    // Upsert: update if exists, insert if not
    const existing = await db
      .select()
      .from(memories)
      .where(
        and(
          eq(memories.userId, userId),
          eq(memories.category, category),
          eq(memories.key, key)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(memories)
        .set({ value, metadata: metadata || null, updatedAt: new Date() })
        .where(eq(memories.id, existing[0].id));
    } else {
      await db.insert(memories).values({
        userId,
        category,
        key,
        value,
        metadata: metadata || null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Memory store error:", error);
    return NextResponse.json(
      { error: "Failed to store memory" },
      { status: 500 }
    );
  }
}

/* DELETE: Remove a specific memory */
export async function DELETE(req: NextRequest) {
  try {
    const memoryId = req.nextUrl.searchParams.get("memoryId");

    if (!memoryId) {
      return NextResponse.json(
        { error: "Memory ID required" },
        { status: 400 }
      );
    }

    await db.delete(memories).where(eq(memories.id, parseInt(memoryId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Memory delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete memory" },
      { status: 500 }
    );
  }
}
