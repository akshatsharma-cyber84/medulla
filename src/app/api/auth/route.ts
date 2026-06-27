/* ════════════════════════════════════════════════════════════
 * MEDULLA AI – AUTH API (UPGRADED)
 * - Smart user recognition (returning users skip Formspree)
 * - Formspree deduplication (only first registration)
 * - Login tracking (timestamps, count)
 * - Memory/preferences loading
 * ════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, memories, chatSessions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ADMIN_PHONE, FORMSPREE_ENDPOINT } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const { name, phone } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const phoneStr = String(phone).trim();
    const nameStr = String(name).trim();
    const isAdmin = phoneStr === ADMIN_PHONE;

    // ─────────────────────────────────────────────────────
    // Check if user already exists (returning user)
    // ─────────────────────────────────────────────────────
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.phone, phoneStr))
      .limit(1);

    let userId: number;
    let isNewUser = false;
    let shouldSubmitFormspree = false;
    let userMemories: Array<{ category: string; key: string; value: string }> = [];
    let recentSessions: Array<{ id: number; title: string | null }> = [];

    if (existing.length > 0) {
      // ═══════════════════════════════════════════════════
      // RETURNING USER — Skip Formspree, update login info
      // ═══════════════════════════════════════════════════
      const user = existing[0];
      userId = user.id;
      isNewUser = false;

      // Update login timestamp and count
      await db
        .update(users)
        .set({
          lastLoginAt: new Date(),
          loginCount: (user.loginCount || 0) + 1,
          updatedAt: new Date(),
          // Update name if different (user might correct it)
          name: nameStr,
        })
        .where(eq(users.id, userId));

      // Load user's memories for personalization
      const mems = await db
        .select({
          category: memories.category,
          key: memories.key,
          value: memories.value,
        })
        .from(memories)
        .where(eq(memories.userId, userId))
        .limit(20);
      userMemories = mems;

      // Load recent sessions
      const sessions = await db
        .select({ id: chatSessions.id, title: chatSessions.title })
        .from(chatSessions)
        .where(eq(chatSessions.userId, userId))
        .orderBy(desc(chatSessions.updatedAt))
        .limit(10);
      recentSessions = sessions;

    } else {
      // ═══════════════════════════════════════════════════
      // NEW USER — Register and mark for Formspree
      // ═══════════════════════════════════════════════════
      isNewUser = true;
      shouldSubmitFormspree = !isAdmin; // Admin skips Formspree

      const inserted = await db
        .insert(users)
        .values({
          name: nameStr,
          phone: phoneStr,
          isAdmin,
          formspreeSubmitted: false, // Will be set to true after submission
          loginCount: 1,
          lastLoginAt: new Date(),
        })
        .returning({ id: users.id });
      
      userId = inserted[0].id;
    }

    // ─────────────────────────────────────────────────────
    // Formspree submission (only for NEW non-admin users)
    // ─────────────────────────────────────────────────────
    if (shouldSubmitFormspree) {
      try {
        const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: nameStr,
            phone: phoneStr,
            timestamp: new Date().toISOString(),
            source: "Medulla AI - New Registration",
          }),
        });

        if (formspreeRes.ok) {
          // Mark as submitted to prevent future duplicates
          await db
            .update(users)
            .set({ formspreeSubmitted: true })
            .where(eq(users.id, userId));
        }
      } catch {
        // Formspree failed — still allow access, don't block user
        console.log("Formspree submission failed, user access continues");
      }
    }

    // ─────────────────────────────────────────────────────
    // Return user data with recognition info
    // ─────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      userId,
      name: nameStr,
      isNewUser,
      // Personalization data for returning users
      memories: userMemories,
      recentSessions,
      // Welcome message context
      welcomeContext: isNewUser 
        ? "new" 
        : userMemories.length > 0 
          ? "returning_with_memory" 
          : "returning",
    });

  } catch (error) {
    console.error("Auth error:", error);
    // Even on error, allow access (never block the user)
    return NextResponse.json({
      success: true,
      userId: 0,
      name: "Guest",
      isNewUser: true,
      memories: [],
      recentSessions: [],
      welcomeContext: "guest",
    });
  }
}
