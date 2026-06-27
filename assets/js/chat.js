/* ════════════════════════════════════════════════════════════════════════════
 * MEDULLA AI – CHAT ENGINE
 * Dual-mode: Internal Knowledge Base + GPT API (via secure proxy)
 * GitHub Pages Compatible
 * ════════════════════════════════════════════════════════════════════════════ */

// Chat state
let chatMessages = [];
let currentSessionId = null;

// ═══════════════════════════════════════════════════════════════════════════
// INTERNAL KNOWLEDGE BASE
// Used when GPT API is disabled or as fallback
// ═══════════════════════════════════════════════════════════════════════════

const knowledgeBase = [
  {
    keywords: ["medulla", "kaun hai", "who are you", "kon hai", "about yourself", "introduce", "tum kaun", "tum kaun ho"],
    response: `Main hoon **Medulla AI** 🧠 — tumhara intelligent AI assistant jo **AK Industries** ne design kiya hai!

### Meri Capabilities:
- 💻 **Tech & Programming** — Code, debugging, concepts
- 🔒 **Cybersecurity** — Security, ethical hacking
- 🐧 **Linux** — Commands, scripting, admin
- 📚 **Learning** — Tutorials, career guidance
- 🧠 **Memory** — Preferences yaad rakhta hoon

Main Hinglish mein naturally baat karta hoon. Kuch bhi poochho! 🚀`
  },
  {
    keywords: ["ak industries", "creator", "developer", "kisne banaya", "who made", "who built","tumhe kisne au kaise banaya"],
    response: `Mujhe **AK Industries** ne build kiya hai! 🏢

AK Industries innovative tech solutions aur AI applications develop karti hai.

Website: [AK Industries](https://akshatsharma-cyber84.github.io/AK_world) 🌐`
  },
  {
    keywords: ["linux", "terminal", "command line", "ubuntu", "kali", "bash", "shell"],
    response: `**Linux Master Karna Hai? Let's Go! 🐧**

### Essential Commands:
\`\`\`bash
ls -la          # File listing
cd /path        # Change directory
pwd             # Current path
cp src dest     # Copy
mv src dest     # Move/rename
rm -rf dir      # Delete (careful!)
chmod +x file   # Make executable
sudo apt update # Update system
\`\`\`

### Learning Path:
1. **Beginner:** Ubuntu/Mint install karo
2. **Intermediate:** Shell scripting
3. **Advanced:** System admin, networking
4. **Expert:** Kali Linux for security

Kaunsa area explore karna hai? 🎯`
  },
  {
    keywords: ["python", "python seekh", "python learn", "django", "flask"],
    response: `**Python — Best Language to Start! 🐍**

### Quick Example:
\`\`\`python
# Variables
name = "Medulla AI"
skills = ["Python", "AI", "Web"]

# Function
def greet(user):
    return f"Hello {user}!"

# List comprehension
squares = [x**2 for x in range(10)]

# File handling
with open("data.txt", "w") as f:
    f.write("Learning Python!")
\`\`\`

### Career Paths:
| Path | Tools |
|------|-------|
| Web | Django, Flask, FastAPI |
| Data | Pandas, NumPy |
| AI/ML | TensorFlow, PyTorch |
| Automation | Selenium, Scripts |

Kaunsa interesting lagta hai? 🎯`
  },
  {
    keywords: ["cybersecurity", "hacking", "ethical hacking", "security", "cyber", "pentesting"],
    response: `**Cybersecurity Career? Solid Choice! 🔒**

### Roadmap:
\`\`\`
Level 1: Foundation
├── Networking (TCP/IP, DNS)
├── Linux basics
└── Python + Bash

Level 2: Security
├── OWASP Top 10
├── Cryptography
└── Security tools

Level 3: Specialization
├── Web Security
├── Network Security
├── Penetration Testing
└── Cloud Security
\`\`\`

### Tools:
- **Recon:** Nmap, Shodan
- **Web:** Burp Suite, ZAP
- **Exploit:** Metasploit

### Practice:
- TryHackMe (beginner)
- HackTheBox (advanced)
- PortSwigger Academy (free!)

Kahan se start karein? 🛡️`
  },
  {
    keywords: ["javascript", "js", "web development", "frontend", "react", "node"],
    response: `**JavaScript — Web Ka King! ⚡**

### Modern JS:
\`\`\`javascript
// ES6+ Features
const user = { name: "Dev", skills: ["JS"] };
const { name } = user;

// Arrow Functions
const greet = (n) => \`Hello, \${n}!\`;

// Async/Await
const getData = async () => {
  const res = await fetch('/api');
  return res.json();
};

// Array Methods
const doubled = [1,2,3].map(n => n * 2);
\`\`\`

### Stacks:
| Frontend | Backend | Full-Stack |
|----------|---------|------------|
| React | Node.js | Next.js |
| Vue | Express | Nuxt |
| Svelte | Fastify | SvelteKit |

Frontend ya backend? 💻`
  },
  {
    keywords: ["hello", "hi", "hey", "namaste", "kaise ho", "how are you", "hii"],
    response: `Hey bhai! 👋 Kaise ho?

Main **Medulla AI** — tumhara AI buddy! 

Kuch bhi poochho:
- 💻 Coding help
- 🔒 Cybersecurity
- 📚 Learning
- 🎯 Career advice

Batao, kya karna hai? 🚀`
  },
  {
    keywords: ["thank", "thanks", "shukriya", "dhanyavaad", "thnx"],
    response: `Are bhai, koi baat nahi! 😊

Yahi toh mera kaam hai. Jab bhi doubt ho — aa jaana. 24/7 available hoon! 💪

Aur kuch help chahiye? 🚀`
  },
  {
    keywords: ["bye", "goodbye", "alvida", "see you", "nikalta"],
    response: `Bye bhai! 👋 

Jab bhi zaroorat ho, wapas aa jaana!

Keep learning, keep building! 🚀

*— Medulla AI*`
  },
  {
    keywords: ["error", "bug", "problem", "issue", "kaam nahi", "not working", "nahi ho raha"],
    response: `**Debug Mode! 🔧**

Error fix karne ke liye batao:

1. **Error message** (exact text)
2. **Kya kar rahe the**
3. **Language/Framework**
4. **Code snippet**

### Quick Debug Tips:
\`\`\`
1. Error message padho carefully
2. Console/terminal check karo
3. Recent changes revert karo
4. Google/Stack Overflow search
5. Code ko parts mein test karo
\`\`\`

Apna error paste karo! 💪`
  },
  {
    keywords: ["career", "job", "naukri", "placement", "salary", "interview"],
    response: `**Career Guidance! 🎯**

### Hot Tech Careers:
| Field | Salary | Skills |
|-------|--------|--------|
| Full-Stack | 8-25 LPA | JS, React, Node |
| Data Science | 10-30 LPA | Python, ML |
| Cloud | 8-20 LPA | AWS/Azure |
| Cybersecurity | 8-25 LPA | Security |
| AI/ML | 12-35 LPA | Python, DL |

### Tips:
1. Skills > Degree
2. Projects banao
3. GitHub strong rakho
4. LinkedIn active
5. DSA practice

Kaunsa field? Roadmap dunga! 📈`
  },
  {
    keywords: ["project", "idea", "banau kya", "build", "create"],
    response: `**Project Ideas! 💡**

### Beginner:
- Portfolio website
- To-do app
- Calculator
- Weather app (API)

### Intermediate:
- Blog platform
- E-commerce page
- Chat app
- URL shortener

### Advanced:
- Social media clone
- AI chatbot
- Real-time collab tool
- Video streaming

Skill level batao — specific suggest karunga! 🚀`
  },
  {
    keywords: ["api", "rest", "fetch", "axios", "http"],
    response: `**API Development! 🔌**

### REST API Basics:
\`\`\`javascript
// GET Request
const response = await fetch('/api/users');
const data = await response.json();

// POST Request
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'User' })
});
\`\`\`

### HTTP Methods:
| Method | Use |
|--------|-----|
| GET | Read data |
| POST | Create |
| PUT | Update (full) |
| PATCH | Update (partial) |
| DELETE | Remove |

API banana hai ya consume karna hai? 🎯`
  },
  {
    keywords: ["git", "github", "version control", "commit", "push"],
    response: `**Git & GitHub! 📦**

### Essential Commands:
\`\`\`bash
git init                    # Initialize
git add .                   # Stage all
git commit -m "message"     # Commit
git push origin main        # Push
git pull                    # Pull changes
git branch feature          # New branch
git checkout feature        # Switch branch
git merge feature           # Merge
\`\`\`

### Workflow:
1. Fork/Clone repo
2. Create feature branch
3. Make changes
4. Commit with clear message
5. Push & create PR

GitHub profile strong rakho — recruiters dekhte hain! 🚀`
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// GPT API INTEGRATION (Via Secure Proxy)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Call GPT API through secure backend proxy
 * ⚠️ Never expose API keys in frontend!
 */
async function callGPTAPI(message, history = []) {
  if (!CONFIG.GPT_API_ENABLED || !CONFIG.GPT_API_ENDPOINT) {
    return null;
  }

  try {
    const response = await fetch(CONFIG.GPT_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        history: history.slice(-10), // Last 10 messages for context
        user: getCurrentUser()?.name || "User"
      })
    });

    if (!response.ok) {
      console.warn("GPT API error, falling back to internal KB");
      return null;
    }

    const data = await response.json();
    return data.response || data.message || null;

  } catch (error) {
    console.warn("GPT API call failed:", error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSE GENERATION
// ═══════════════════════════════════════════════════════════════════════════

function searchKnowledge(query) {
  const lower = query.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const matchCount = entry.keywords.filter(kw => lower.includes(kw)).length;
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = entry;
    }
  }

  return bestMatch ? bestMatch.response : null;
}

function generateContextualResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes("code") || lower.includes("program") || lower.includes("function")) {
    return `**Code Help! 💻**

Coding mein help ke liye batao:
1. **Language** — Python, JS, Java?
2. **Kya banana hai** — Function, class?
3. **Context** — Web, data, automation?

Ya seedha poochho jaise:
- "Python mein list sort karo"
- "JS mein API call kaise karein"

Poochho! 🚀`;
  }

  if (lower.includes("seekh") || lower.includes("learn") || lower.includes("start")) {
    return `**Learning Path! 📚**

Kya seekhna hai specifically?

### Approach:
1. **Foundation** — Basics samjho
2. **Practice** — Daily coding
3. **Build** — Projects banao
4. **Share** — Portfolio

Technology batao — detailed roadmap dunga! 🎯`;
  }

  return null;
}

/**
 * Main response generator
 * Priority: GPT API > Internal KB > Contextual > Fallback
 */
async function generateAIResponse(message, history = [], memories = []) {
  // Try GPT API first (if enabled)
  if (CONFIG.GPT_API_ENABLED) {
    const gptResponse = await callGPTAPI(message, history);
    if (gptResponse) {
      return gptResponse;
    }
  }

  // Fallback to internal knowledge base
  if (CONFIG.USE_INTERNAL_KB) {
    const kbResponse = searchKnowledge(message);
    if (kbResponse) {
      return kbResponse;
    }

    const contextual = generateContextualResponse(message);
    if (contextual) {
      return contextual;
    }
  }

  // Final fallback
  return `Interesting question! 🤔

Mujhe thoda detail chahiye:
1. Specifically kya jaanna hai?
2. Context kya hai?
3. Koi example?

Main tech, coding, cybersecurity, career pe help kar sakta hoon!

Ya [AK Industries](${CONFIG.AK_CONTACT_URL}) ko contact karo. 📩`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MARKDOWN RENDERING
// ═══════════════════════════════════════════════════════════════════════════

function renderMarkdown(text) {
  let html = text;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escaped = code.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-lang">${lang || "code"}</span><button class="copy-code-btn" onclick="copyCode(this)">📋 Copy</button></div><pre><code>${escaped}</code></pre></div>`;
  });

  // Tables
  html = html.replace(/\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
    const headers = header.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Inline code, headings, bold, italic, links, blockquotes, lists
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/^[*-] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, "<ul>$1</ul>");
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");

  if (!html.startsWith("<")) {
    html = `<p>${html}</p>`;
  }

  return html;
}

function copyCode(btn) {
  const code = btn.closest(".code-block-wrapper").querySelector("code");
  if (code) {
    navigator.clipboard.writeText(code.textContent || "");
    btn.textContent = "✅ Copied!";
    setTimeout(() => btn.textContent = "📋 Copy", 2000);
  }
}
window.copyCode = copyCode;

// ═══════════════════════════════════════════════════════════════════════════
// CHAT OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

function addMessage(role, content) {
  const msg = {
    id: `${role}-${Date.now()}`,
    role: role,
    content: content,
    timestamp: new Date()
  };
  chatMessages.push(msg);
  
  if (currentSessionId) {
    saveChatLocally(currentSessionId, chatMessages);
  }
  return msg;
}

async function sendMessage(message) {
  addMessage("user", message);
  
  const user = getCurrentUser();
  const response = await generateAIResponse(message, chatMessages, user.memories || []);
  
  return addMessage("assistant", response);
}

function startNewChat() {
  currentSessionId = `session-${Date.now()}`;
  chatMessages = [];
}

function loadChatSession(sessionId) {
  const chats = loadChatsLocally();
  if (chats[sessionId]) {
    currentSessionId = sessionId;
    chatMessages = chats[sessionId].messages || [];
    return chatMessages;
  }
  return [];
}

function getChatSessions() {
  const chats = loadChatsLocally();
  return Object.keys(chats).map(id => ({
    id: id,
    title: chats[id].messages?.[0]?.content?.substring(0, 40) || "New Chat",
    updatedAt: chats[id].updatedAt
  })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function deleteChatSession(sessionId) {
  deleteChatLocally(sessionId);
  if (currentSessionId === sessionId) startNewChat();
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

console.log("✅ Chat engine loaded");
