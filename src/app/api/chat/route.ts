/* ════════════════════════════════════════════════════════════
 * MEDULLA AI – CHAT API (UPGRADED)
 * - Memory integration in responses
 * - Context-aware AI generation
 * - Auto memory extraction from conversations
 * ════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, chatSessions, memories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateResponse, extractMemoryFromMessage } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message, userId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let activeSessionId = sessionId;

    // ─────────────────────────────────────────────────────
    // Create new session if none provided
    // ─────────────────────────────────────────────────────
    if (!activeSessionId && userId) {
      const title = message.substring(0, 50) + (message.length > 50 ? "..." : "");
      const newSession = await db
        .insert(chatSessions)
        .values({
          userId,
          title,
        })
        .returning({ id: chatSessions.id });
      activeSessionId = newSession[0].id;
    }

    // ─────────────────────────────────────────────────────
    // Save user message
    // ─────────────────────────────────────────────────────
    if (activeSessionId) {
      await db.insert(messages).values({
        sessionId: activeSessionId,
        role: "user",
        content: message,
      });

      // Update session timestamp
      await db
        .update(chatSessions)
        .set({ updatedAt: new Date() })
        .where(eq(chatSessions.id, activeSessionId));
    }

    // ─────────────────────────────────────────────────────
    // Get chat history for context
    // ─────────────────────────────────────────────────────
    let chatHistory: Array<{ role: string; content: string }> = [];
    if (activeSessionId) {
      const history = await db
        .select({ role: messages.role, content: messages.content })
        .from(messages)
        .where(eq(messages.sessionId, activeSessionId))
        .orderBy(desc(messages.createdAt))
        .limit(20);
      chatHistory = history.reverse();
    }

    // ─────────────────────────────────────────────────────
    // Get user memories for personalization
    // ─────────────────────────────────────────────────────
    let userMemories: Array<{ category: string; key: string; value: string }> = [];
    if (userId) {
      const mems = await db
        .select({
          category: memories.category,
          key: memories.key,
          value: memories.value,
        })
        .from(memories)
        .where(eq(memories.userId, userId))
        .limit(15);
      userMemories = mems;
    }

    // ─────────────────────────────────────────────────────
    // Generate AI response with memory context
    // ─────────────────────────────────────────────────────
    const aiResponse = generateResponse(message, chatHistory, userMemories);

    // ─────────────────────────────────────────────────────
    // Save AI response
    // ─────────────────────────────────────────────────────
    if (activeSessionId) {
      await db.insert(messages).values({
        sessionId: activeSessionId,
        role: "assistant",
        content: aiResponse,
      });
    }

    // ─────────────────────────────────────────────────────
    // Auto-extract and save memory from user message
    // ─────────────────────────────────────────────────────
    if (userId) {
      const memoryToSave = extractMemoryFromMessage(message);
      if (memoryToSave) {
        try {
          await db.insert(memories).values({
            userId,
            category: memoryToSave.category,
            key: memoryToSave.key,
            value: memoryToSave.value,
          });
        } catch {
          // Memory might already exist, ignore
        }
      }
    }

    return NextResponse.json({
      success: true,
      sessionId: activeSessionId,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        success: true,
        sessionId: null,
        response:
          "Ek chhoti si technical issue aa gayi hai bhai. Thodi der mein try karo! 🔧",
      },
      { status: 200 }
    );
  }
}
