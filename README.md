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
