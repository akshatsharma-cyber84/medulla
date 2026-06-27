import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

/* ════════════════════════════════════════════════════════════
 * MEDULLA AI – DATABASE SCHEMA (UPGRADED)
 * PostgreSQL via Drizzle ORM
 * Supports: User tracking, Formspree deduplication, Memory, Sessions
 * ════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────
 * USERS TABLE (UPGRADED)
 * - Tracks registration, login history, Formspree status
 * - Supports returning user recognition
 * ──────────────────────────────────────────────────────── */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
  
  // Registration & Formspree tracking
  formspreeSubmitted: boolean("formspree_submitted").default(false),
  registeredAt: timestamp("registered_at").defaultNow(),
  
  // Login tracking
  lastLoginAt: timestamp("last_login_at").defaultNow(),
  loginCount: integer("login_count").default(1),
  
  // User preferences (JSON for flexibility)
  preferences: jsonb("preferences").default({}),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ────────────────────────────────────────────────────────
 * CHAT SESSIONS TABLE
 * Groups messages into conversations
 * ──────────────────────────────────────────────────────── */
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").default("New Chat"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ────────────────────────────────────────────────────────
 * MESSAGES TABLE
 * Stores individual chat messages (user or AI)
 * ──────────────────────────────────────────────────────── */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => chatSessions.id),
  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ────────────────────────────────────────────────────────
 * MEMORY TABLE (UPGRADED)
 * Stores user preferences, interests, learning contexts
 * Used for personalization and agent-like behavior
 * ──────────────────────────────────────────────────────── */
export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  category: text("category").notNull(), // "interest", "preference", "context", "fact"
  key: text("key").notNull(),
  value: text("value").notNull(),
  importance: integer("importance").default(5), // 1-10 scale for memory prioritization
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ────────────────────────────────────────────────────────
 * USER CONTEXT TABLE (NEW)
 * Stores conversation context for continuity
 * ──────────────────────────────────────────────────────── */
export const userContext = pgTable("user_context", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  contextType: text("context_type").notNull(), // "topic", "mood", "goal"
  contextValue: text("context_value").notNull(),
  expiresAt: timestamp("expires_at"), // Optional expiry for temporary contexts
  createdAt: timestamp("created_at").defaultNow(),
});
