# 🧠 Medulla AI – GitHub Pages Deployment Guide

## Overview
Medulla AI is an intelligent assistant by AK Industries. This version is **100% GitHub Pages compatible** — no server required for the frontend.

---

## 📁 Project Structure

```
/MedullaAI (Repository Root)
│
├── index.html              ← PRIMARY ENTRY POINT
├── README.md               ← This file
│
├── assets/
│   ├── css/
│   │   └── style.css       ← All styles (glassmorphism, animations)
│   │
│   └── js/
│       ├── config.js       ← Configuration (Supabase, API endpoints)
│       ├── supabase.js     ← Database operations
│       ├── auth.js         ← Login, registration, Formspree
│       ├── chat.js         ← AI engine + GPT integration
│       ├── memory.js       ← Memory management
│       └── app.js          ← Main controller
│
└── api/
    └── gpt-proxy-example.js ← Backend proxy example (deploy separately)
```

---

## 🚀 Deployment to GitHub Pages

### Step 1: Create Repository
1. Go to [github.com](https://github.com) → New Repository
2. Name: `MedullaAI` (or any name)
3. Make it **Public**

### Step 2: Upload Files
Upload these files to the repository root:
- `index.html`
- `assets/` folder (with css/ and js/)
- `README.md`

**⚠️ Do NOT upload the `/api` folder** — that's for a separate backend.

### Step 3: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Click **Save**

### Step 4: Access Your Site
After 1-2 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/MedullaAI/
```

---

## 🗄️ Supabase Database Setup

### Create Tables in Supabase

Go to your Supabase project → **SQL Editor** → Run:

```sql
-- ═══════════════════════════════════════════════════════════════
-- USERS TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON users FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- PREFERENCES TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  preference_key TEXT NOT NULL,
  preference_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON preferences FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- MEMORY TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE memory (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  memory_title TEXT NOT NULL,
  memory_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON memory FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_preferences_user ON preferences(user_id);
CREATE INDEX idx_memory_user ON memory(user_id);
```

### Current Configuration
```
Project URL: https://zilotvwgpbkbmtakfevy.supabase.co
Anon Key: Already configured in config.js
```

---

## 🤖 GPT API Integration

### Architecture
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  GitHub Pages   │────▶│  Backend Proxy   │────▶│  OpenAI API │
│  (Frontend)     │     │  (Vercel/CF)     │     │             │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

### Why a Proxy?
- **GitHub Pages is public** — API keys would be exposed
- **Backend proxy keeps keys secure** on the server
- Frontend only knows the proxy URL

### Setup GPT (Optional)

#### 1. Deploy Backend Proxy
Choose one platform (all have free tiers):

**Vercel (Recommended)**
```javascript
// /api/chat.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { message, history, user } = await req.json();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are Medulla AI. Speak Hinglish. User: ${user}` },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message }
      ]
    })
  });
  
  const data = await response.json();
  return new Response(JSON.stringify({
    response: data.choices?.[0]?.message?.content
  }));
}
```

#### 2. Set Environment Variable
In Vercel/Cloudflare dashboard:
```
OPENAI_API_KEY = sk-your-key-here
```

#### 3. Update config.js
```javascript
GPT_API_ENABLED: true,
GPT_API_ENDPOINT: "https://your-proxy.vercel.app/api/chat"
```

#### 4. Redeploy GitHub Pages

---

## 🔐 Security Features

### Admin Access
- **Phone:** 8601264402
- Bypasses Formspree registration
- No UI indicators (silent)

### Formspree Deduplication
- New users → Send to Formspree
- Returning users → Skip (no duplicates)

### API Key Protection
- OpenAI keys: Server-side only (proxy)
- Supabase anon key: Safe for frontend (RLS enabled)

---

## ✨ Features

| Feature | Status |
|---------|--------|
| GitHub Pages Compatible | ✅ |
| Single index.html Entry | ✅ |
| Supabase Integration | ✅ |
| Formspree (No Duplicates) | ✅ |
| Admin Bypass | ✅ |
| GPT API Ready | ✅ |
| Internal Knowledge Base | ✅ |
| Hinglish Responses | ✅ |
| Premium 2026 UI | ✅ |
| Mouse-Reactive Glow | ✅ |
| Chat History | ✅ |
| Memory System | ✅ |
| Code Highlighting | ✅ |
| Responsive Design | ✅ |

---

## 🔧 Customization

### Change Supabase Project
Edit `assets/js/config.js`:
```javascript
SUPABASE_URL: "https://your-project.supabase.co",
SUPABASE_ANON_KEY: "your-anon-key"
```

### Add Knowledge Base Entries
Edit `assets/js/chat.js` → `knowledgeBase` array

### Change Theme Colors
Edit `assets/css/style.css` → `:root` variables

---

## 🏢 Credits
Built by **AK Industries**
- Website: https://akshatsharma-cyber84.github.io/AK_world
- Contact: https://akshatsharma-cyber84.github.io/AK_world/#contact

---

**Version 2.0** • GitHub Pages Edition • Built with ❤️
