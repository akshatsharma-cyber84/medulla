/* ════════════════════════════════════════════════════════════
 * MEDULLA AI – AI ENGINE (UPGRADED)
 * Agent-like behavior with:
 * - Intent detection
 * - Memory integration
 * - Context awareness
 * - Conversation continuity
 * - Smart decision making
 * ════════════════════════════════════════════════════════════ */

import { AI_SYSTEM_PROMPT, FALLBACK_RESPONSE, AK_CONTACT_URL } from "./config";

/* ──────────────────────────────────────────────────────────
 * TYPE DEFINITIONS
 * ────────────────────────────────────────────────────────── */
interface ConversationContext {
  recentTopics: string[];
  userMood: "neutral" | "curious" | "frustrated" | "excited";
  lastIntent: string;
}

interface UserMemory {
  category: string;
  key: string;
  value: string;
}

interface IntentResult {
  intent: string;
  confidence: number;
  entities: string[];
  requiresSearch: boolean;
  suggestedAction: "answer" | "clarify" | "search" | "remember";
}

/* ──────────────────────────────────────────────────────────
 * INTENT DETECTION
 * Analyzes user message to understand what they actually want
 * ────────────────────────────────────────────────────────── */
function detectIntent(message: string): IntentResult {
  const lower = message.toLowerCase();
  const words = lower.split(/\s+/);
  
  // Question indicators
  const questionWords = ["kya", "kaise", "kyun", "kab", "kahan", "kaun", "what", "how", "why", "when", "where", "who", "which"];
  const isQuestion = questionWords.some(w => lower.includes(w)) || message.includes("?");
  
  // Intent patterns
  const intents: { pattern: RegExp | string[]; intent: string; action: "answer" | "clarify" | "search" | "remember" }[] = [
    { pattern: ["seekh", "learn", "sikhna", "tutorial", "guide", "start"], intent: "learn", action: "answer" },
    { pattern: ["kya hai", "what is", "define", "meaning", "matlab"], intent: "define", action: "answer" },
    { pattern: ["kaise", "how to", "tarika", "method", "steps"], intent: "howto", action: "answer" },
    { pattern: ["error", "bug", "problem", "issue", "nahi ho raha", "not working"], intent: "debug", action: "clarify" },
    { pattern: ["compare", "vs", "difference", "better", "best"], intent: "compare", action: "answer" },
    { pattern: ["code", "program", "script", "function", "likh"], intent: "code", action: "answer" },
    { pattern: ["career", "job", "naukri", "placement", "salary"], intent: "career", action: "answer" },
    { pattern: ["news", "latest", "recent", "2024", "2025", "current"], intent: "current_info", action: "search" },
    { pattern: ["yaad", "remember", "note", "save", "mera"], intent: "memory", action: "remember" },
    { pattern: ["thanks", "shukriya", "dhanyavaad", "thank you"], intent: "gratitude", action: "answer" },
    { pattern: ["hi", "hello", "hey", "namaste", "kaise ho"], intent: "greeting", action: "answer" },
    { pattern: ["bye", "alvida", "goodbye", "see you"], intent: "farewell", action: "answer" },
  ];

  for (const { pattern, intent, action } of intents) {
    const matches = Array.isArray(pattern) 
      ? pattern.some(p => lower.includes(p))
      : pattern.test(lower);
    if (matches) {
      return {
        intent,
        confidence: 0.8,
        entities: extractEntities(lower),
        requiresSearch: action === "search",
        suggestedAction: action,
      };
    }
  }

  // Default: general query
  return {
    intent: isQuestion ? "question" : "statement",
    confidence: 0.5,
    entities: extractEntities(lower),
    requiresSearch: false,
    suggestedAction: "answer",
  };
}

/* ──────────────────────────────────────────────────────────
 * ENTITY EXTRACTION
 * Extracts key topics/subjects from message
 * ────────────────────────────────────────────────────────── */
function extractEntities(text: string): string[] {
  const techTerms = [
    "python", "javascript", "js", "java", "c++", "cpp", "rust", "go", "ruby",
    "linux", "ubuntu", "kali", "windows", "macos",
    "react", "vue", "angular", "nextjs", "node", "django", "flask",
    "ai", "ml", "machine learning", "deep learning", "neural",
    "cybersecurity", "hacking", "security", "encryption", "firewall",
    "database", "sql", "mongodb", "postgresql", "mysql",
    "docker", "kubernetes", "aws", "cloud", "devops",
    "html", "css", "frontend", "backend", "fullstack", "api",
    "git", "github", "version control",
  ];

  const found: string[] = [];
  for (const term of techTerms) {
    if (text.includes(term)) {
      found.push(term);
    }
  }
  return found;
}

/* ──────────────────────────────────────────────────────────
 * ANALYZE CONVERSATION CONTEXT
 * Tracks conversation flow and user mood
 * ────────────────────────────────────────────────────────── */
function analyzeContext(
  history: Array<{ role: string; content: string }>
): ConversationContext {
  const recentTopics: string[] = [];
  let userMood: "neutral" | "curious" | "frustrated" | "excited" = "neutral";
  let lastIntent = "";

  // Analyze last few messages for context
  const recent = history.slice(-6);
  for (const msg of recent) {
    if (msg.role === "user") {
      const entities = extractEntities(msg.content.toLowerCase());
      recentTopics.push(...entities);
      
      // Mood detection
      const lower = msg.content.toLowerCase();
      if (lower.includes("!") || lower.includes("awesome") || lower.includes("great") || lower.includes("maza")) {
        userMood = "excited";
      } else if (lower.includes("error") || lower.includes("problem") || lower.includes("nahi") || lower.includes("frustrated")) {
        userMood = "frustrated";
      } else if (lower.includes("?") || lower.includes("kya") || lower.includes("kaise")) {
        userMood = "curious";
      }
      
      lastIntent = detectIntent(msg.content).intent;
    }
  }

  return {
    recentTopics: [...new Set(recentTopics)],
    userMood,
    lastIntent,
  };
}

/* ──────────────────────────────────────────────────────────
 * ENHANCED KNOWLEDGE BASE
 * Categorized responses with context awareness
 * ────────────────────────────────────────────────────────── */
interface KnowledgeEntry {
  keywords: string[];
  response: string;
  followUp?: string;
}

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["medulla", "kaun hai", "who are you", "kon hai", "about yourself", "introduce", "tum kaun"],
    response: `Main hoon **Medulla AI** 🧠 — tumhara intelligent AI buddy jo **AK Industries** ne design kiya hai!

### Meri Capabilities:
- 💻 **Tech & Programming** — Code likhna, debug karna, concepts explain karna
- 🔒 **Cybersecurity** — Security concepts, ethical hacking guidance
- 🐧 **Linux** — Commands, shell scripting, system administration
- 📚 **Learning** — Step-by-step tutorials, career guidance
- 🧠 **Memory** — Tumhari preferences aur interests yaad rakhta hoon

Main Hinglish mein naturally baat karta hoon. Kuch bhi poochho — serious tech se lekar casual chat tak! 🚀`,
    followUp: "Kya specific topic mein help chahiye?"
  },
  {
    keywords: ["ak industries", "creator", "developer", "kisne banaya", "who made", "who built", "company"],
    response: `Mujhe **AK Industries** ne build kiya hai! 🏢

AK Industries ek innovative tech company hai jo AI solutions aur web applications develop karti hai. Mere creators ne mujhe specifically Hinglish mein naturally baat karne ke liye train kiya hai.

### Features:
- 🎯 Intent-based responses
- 🧠 Smart memory system
- 💡 Personalized experience

Zyada info ke liye: [AK Industries Website](https://akshatsharma-cyber84.github.io/AK_world) 🌐`
  },
  {
    keywords: ["linux", "terminal", "command line", "ubuntu", "kali", "bash", "shell"],
    response: `**Linux Master Karna Hai? Chal Start Karte Hain! 🐧**

### Essential Commands:
\`\`\`bash
# Navigation
ls -la          # Detailed file list
cd /path        # Change directory
pwd             # Current location

# File Operations
cp file dest    # Copy
mv file dest    # Move/Rename
rm -rf folder   # Delete (careful!)
chmod +x file   # Make executable

# System
sudo apt update && sudo apt upgrade  # Update system
top / htop      # Process monitor
df -h           # Disk usage
free -m         # Memory usage
\`\`\`

### Learning Path:
1. **Beginner:** Ubuntu/Linux Mint pe practice
2. **Intermediate:** Shell scripting, cron jobs
3. **Advanced:** System administration, networking
4. **Expert:** Kali Linux for security testing

Kaunsa specific area explore karna hai? 🎯`,
    followUp: "Terminal commands, shell scripting, ya system admin?"
  },
  {
    keywords: ["python", "python seekh", "python learn", "python start", "django", "flask"],
    response: `**Python — Best Language to Start! 🐍**

### Quick Start:
\`\`\`python
# Variables & Data Types
name = "Medulla AI"
numbers = [1, 2, 3, 4, 5]
user_info = {"name": "User", "age": 25}

# Functions
def greet(name: str) -> str:
    return f"Hello {name}! Welcome to Python!"

# List Comprehension
squares = [x**2 for x in range(10)]

# File Handling
with open("data.txt", "w") as f:
    f.write("Learning Python!")
\`\`\`

### Career Paths with Python:
| Path | Tools/Frameworks |
|------|------------------|
| Web Dev | Django, Flask, FastAPI |
| Data Science | Pandas, NumPy, Matplotlib |
| AI/ML | TensorFlow, PyTorch, Scikit-learn |
| Automation | Selenium, BeautifulSoup |
| DevOps | Ansible, Fabric |

Kaunsa path interesting lagta hai? Main guide karta hoon! 🎯`
  },
  {
    keywords: ["cybersecurity", "hacking", "ethical hacking", "security", "cyber", "pentesting"],
    response: `**Cybersecurity Mein Career? Solid Choice! 🔒**

### The Roadmap:
\`\`\`
Level 1: Foundation
├── Networking (TCP/IP, DNS, HTTP/S)
├── Linux basics
└── Programming (Python + Bash)

Level 2: Security Fundamentals  
├── OWASP Top 10
├── Cryptography basics
└── Security tools (Nmap, Wireshark)

Level 3: Specialization
├── Web App Security
├── Network Security
├── Malware Analysis
└── Cloud Security

Level 4: Professional
├── Bug Bounty hunting
├── Penetration Testing
└── Red/Blue Team operations
\`\`\`

### Must-Learn Tools:
- **Recon:** Nmap, Shodan, theHarvester
- **Web:** Burp Suite, OWASP ZAP, SQLmap
- **Wireless:** Aircrack-ng, Wifite
- **Post-Exploit:** Metasploit, Mimikatz

### Practice Platforms:
- TryHackMe (beginner-friendly)
- HackTheBox (intermediate-advanced)
- PortSwigger Web Academy (free!)

Kahan se start karna hai? Batao! 🛡️`
  },
  {
    keywords: ["javascript", "js", "web development", "frontend", "react", "node", "nextjs"],
    response: `**JavaScript — Web Ka King! ⚡**

### Modern JS Essentials:
\`\`\`javascript
// ES6+ Features
const user = { name: "Dev", skills: ["JS", "React"] };
const { name, skills } = user;  // Destructuring

// Arrow Functions
const greet = (name) => \`Hello, \${name}!\`;

// Async/Await
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Array Methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
\`\`\`

### Tech Stack Options:
| Frontend | Backend | Full-Stack |
|----------|---------|------------|
| React | Node.js | Next.js |
| Vue | Express | Nuxt |
| Svelte | Fastify | SvelteKit |

Frontend ya backend — kya seekhna hai? 💻`
  },
  {
    keywords: ["hello", "hi", "hey", "namaste", "kaise ho", "how are you", "sup", "hii", "helo"],
    response: `Hey bhai! 👋 Kaise ho? Main theek hoon — ready to help!

Main **Medulla AI** hoon — tumhara personal AI assistant. Kuch bhi poochho:
- 💻 Coding help chahiye?
- 🔒 Cybersecurity explore karna hai?
- 📚 Kuch naya seekhna hai?
- 🎯 Career guidance?

Batao, kya karna hai aaj? 🚀`
  },
  {
    keywords: ["thank", "thanks", "shukriya", "dhanyavaad", "thnx", "thx"],
    response: `Are bhai, koi baat nahi! 😊 Yahi toh mera kaam hai.

Jab bhi koi doubt ho — coding, tech, career, kuch bhi — seedha aa jaana. Main 24/7 yahan hoon! 💪

**Tip:** Agar kuch interesting seekha ho, practice zaroor karna. Learning + Practice = Mastery! 🎯

Aur kuch help chahiye? 🚀`
  },
  {
    keywords: ["bye", "goodbye", "alvida", "see you", "chal", "nikalta"],
    response: `Bye bhai! 👋 

Jab bhi zaroorat ho, wapas aa jaana. Main yahan hi hounga! 

Keep learning, keep building! 🚀

*— Medulla AI*`
  },
  {
    keywords: ["error", "bug", "problem", "issue", "kaam nahi", "not working", "nahi ho raha", "help"],
    response: `**Debugging Mode On! 🔧**

Error fix karne ke liye mujhe ye batao:

1. **Kya error message aa raha hai?** (exact text)
2. **Kya karne ki koshish kar rahe ho?**
3. **Kaunsi language/framework use kar rahe ho?**
4. **Code snippet share kar sakte ho?**

Common debugging steps:
\`\`\`
1. Error message carefully padho
2. Console/terminal output check karo
3. Recent changes revert karke dekho
4. Stack Overflow pe similar error search karo
5. Code ko chhote parts mein test karo
\`\`\`

Apna code ya error paste karo — main help karta hoon! 💪`
  },
  {
    keywords: ["career", "job", "naukri", "placement", "salary", "interview", "resume"],
    response: `**Career Guidance Time! 🎯**

### Hot Tech Careers (2024-25):
| Field | Avg Salary (India) | Skills Needed |
|-------|-------------------|---------------|
| Full-Stack Dev | 8-25 LPA | JS, React, Node, DBs |
| Data Scientist | 10-30 LPA | Python, ML, Stats |
| Cloud Engineer | 8-20 LPA | AWS/Azure, DevOps |
| Cybersecurity | 8-25 LPA | Security, Networks |
| AI/ML Engineer | 12-35 LPA | Python, Deep Learning |

### Career Building Tips:
1. **Skills > Degree** — Build projects, contribute to open source
2. **Portfolio** — GitHub profile strong rakho
3. **Network** — LinkedIn active rakho, communities join karo
4. **DSA** — Interview cracking ke liye essential
5. **Consistency** — Daily 2-3 ghante focused learning

Kaunsa field interest karta hai? Detailed roadmap de sakta hoon! 📈`
  },
  {
    keywords: ["project", "idea", "banau kya", "build", "create", "bana"],
    response: `**Project Ideas — Skill Level Wise! 💡**

### Beginner:
- Personal portfolio website
- To-do app with local storage
- Calculator with history
- Weather app using API

### Intermediate:
- Blog platform (CRUD operations)
- E-commerce product page
- Chat application (Socket.io)
- URL shortener

### Advanced:
- Social media clone (Instagram/Twitter)
- Real-time collaboration tool
- AI chatbot (like me! 🧠)
- Video streaming platform

### Portfolio Must-Haves:
1. **GitHub** — Clean code, good READMEs
2. **Live Demos** — Deployed projects
3. **Variety** — Different types of projects
4. **Documentation** — Technical writing

Kaunsa skill level hai tera? Project suggest karta hoon! 🚀`
  },
];

/* ──────────────────────────────────────────────────────────
 * SEARCH KNOWLEDGE BASE
 * Returns best matching response with confidence
 * ────────────────────────────────────────────────────────── */
function searchKnowledge(query: string): { response: string; followUp?: string; confidence: number } | null {
  const lowerQuery = query.toLowerCase();
  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const matchCount = entry.keywords.filter(kw => lowerQuery.includes(kw)).length;
    const score = matchCount / entry.keywords.length;
    
    if (matchCount > 0 && score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0.1) {
    return {
      response: bestMatch.response,
      followUp: bestMatch.followUp,
      confidence: bestScore,
    };
  }

  return null;
}

/* ──────────────────────────────────────────────────────────
 * PERSONALIZE RESPONSE
 * Adds context from user memory and conversation
 * ────────────────────────────────────────────────────────── */
function personalizeResponse(
  response: string,
  memories: UserMemory[],
  context: ConversationContext
): string {
  let personalized = response;

  // Add reference to recent topics if relevant
  if (context.recentTopics.length > 0) {
    const topics = context.recentTopics.slice(0, 2).join(", ");
    // Only add if not already discussing these topics
    if (!response.toLowerCase().includes(topics)) {
      // personalized = `${personalized}\n\n*Based on our discussion about ${topics}...*`;
    }
  }

  // Adjust tone based on mood
  if (context.userMood === "frustrated") {
    personalized = personalized.replace(
      /^/,
      "Samajh sakta hoon, thoda frustrating ho sakta hai. Let me help! 💪\n\n"
    );
  }

  // Reference user interests from memory
  const interests = memories.filter(m => m.category === "interest");
  if (interests.length > 0 && Math.random() > 0.7) {
    const interest = interests[0];
    personalized += `\n\n*BTW, ${interest.value} mein interest hai na tera? Related info chahiye to batana!*`;
  }

  return personalized;
}

/* ──────────────────────────────────────────────────────────
 * GENERATE CONTEXTUAL RESPONSE
 * For queries not in knowledge base
 * ────────────────────────────────────────────────────────── */
function generateContextualResponse(
  message: string,
  intent: IntentResult,
  context: ConversationContext
): string | null {
  const lower = message.toLowerCase();

  // Continuation of previous topic
  if (context.recentTopics.length > 0 && containsAny(lower, ["aur", "more", "detail", "continue", "aage"])) {
    return `Bilkul! **${context.recentTopics[0]}** ke baare mein aur detail mein jaate hain...

Pichli baat ko continue karte hue, aur kya specific aspect explore karna hai? 🎯

Options:
1. Practical examples dekho
2. Code/implementation seekho
3. Advanced concepts explore karo
4. Real-world use cases

Kya prefer karoge? 💡`;
  }

  // Programming/Code related
  if (intent.intent === "code" || containsAny(lower, ["code", "program", "function", "class", "algorithm"])) {
    return `**Code Help Mode! 💻**

Coding mein help ke liye mujhe batao:

1. **Language:** Python, JS, Java, C++?
2. **Kya banana hai:** Function, class, algorithm?
3. **Context:** Web, data, automation?

Ya phir seedha sawal poochho — jaise:
- "Python mein list sort kaise karu?"
- "JS mein async/await kaise use karu?"
- "API call kaise banate hain?"

Poochho! 🚀`;
  }

  // Learning intent
  if (intent.intent === "learn") {
    const entities = intent.entities.join(", ") || "naye skills";
    return `**Learning Path for ${entities}! 📚**

Seekhne ke liye structured approach:

### Step 1: Foundation
- Basic concepts samjho
- Official docs padho
- Simple examples try karo

### Step 2: Practice
- Small projects banao
- Errors se seekho
- Daily coding practice

### Step 3: Build
- Real projects create karo
- Open source contribute karo
- Portfolio build karo

Kahan se start karna hai specifically? 🎯`;
  }

  // Comparison questions
  if (intent.intent === "compare" || containsAny(lower, ["better", "best", "vs", "compare", "difference"])) {
    return `**Comparison Analysis! 🔍**

Achhi comparison ke liye batao:

1. Kaunsi 2 cheezein compare karni hain?
2. Context kya hai? (learning, job, project)
3. Priority kya hai? (speed, ease, career)

Phir main detailed comparison dunga:
- Pros & Cons
- Use cases
- Recommendations

Batao, kya compare karna hai? 📊`;
  }

  // Debug/Error help
  if (intent.intent === "debug") {
    return `**Debug Assistant Ready! 🔧**

Error solve karne ke liye ye share karo:

1. ❌ **Error message** (exact copy-paste)
2. 📝 **Code snippet** (relevant part)
3. 🎯 **Kya expected tha** vs kya ho raha hai
4. 🔄 **Recent changes** jo kiye

Common fixes:
- Syntax check karo
- Variable names verify karo
- Console.log/print statements lagao
- Dependencies check karo

Apna error paste karo! 💪`;
  }

  return null;
}

/* ──────────────────────────────────────────────────────────
 * MAIN RESPONSE GENERATOR
 * Entry point for AI response generation
 * ────────────────────────────────────────────────────────── */
export function generateResponse(
  userMessage: string,
  chatHistory: Array<{ role: string; content: string }>,
  userMemories: UserMemory[] = []
): string {
  // Step 1: Detect intent
  const intent = detectIntent(userMessage);
  
  // Step 2: Analyze conversation context
  const context = analyzeContext(chatHistory);
  
  // Step 3: Search knowledge base
  const kbResult = searchKnowledge(userMessage);
  
  if (kbResult && kbResult.confidence > 0.2) {
    let response = kbResult.response;
    
    // Personalize based on memory and context
    response = personalizeResponse(response, userMemories, context);
    
    // Add follow-up if available
    if (kbResult.followUp) {
      response += `\n\n---\n💡 *${kbResult.followUp}*`;
    }
    
    return response;
  }
  
  // Step 4: Generate contextual response
  const contextualResponse = generateContextualResponse(userMessage, intent, context);
  if (contextualResponse) {
    return personalizeResponse(contextualResponse, userMemories, context);
  }
  
  // Step 5: Handle clarification
  if (intent.suggestedAction === "clarify") {
    return `Hmm, thoda clearly samjhana padega bhai! 🤔

Mujhe exactly batao:
1. Kya achieve karna hai?
2. Kya try kiya already?
3. Kahan pe stuck ho?

Details ke saath main better help kar paunga! 💪`;
  }

  // Step 6: Fallback
  return `${FALLBACK_RESPONSE}

[📩 Contact AK Industries](${AK_CONTACT_URL})`;
}

/* ──────────────────────────────────────────────────────────
 * UTILITY: Check if text contains any keywords
 * ────────────────────────────────────────────────────────── */
function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some(kw => text.includes(kw));
}

/* ──────────────────────────────────────────────────────────
 * GET SYSTEM PROMPT
 * ────────────────────────────────────────────────────────── */
export function getSystemPrompt(): string {
  return AI_SYSTEM_PROMPT;
}

/* ──────────────────────────────────────────────────────────
 * EXTRACT MEMORY FROM CONVERSATION
 * Identifies facts to remember about user
 * ────────────────────────────────────────────────────────── */
export function extractMemoryFromMessage(
  message: string
): { category: string; key: string; value: string } | null {
  const lower = message.toLowerCase();
  
  // Interest detection
  const interestPatterns = [
    { pattern: /(?:mujhe|main|i like|interested in|seekh raha|learning)\s+(\w+(?:\s+\w+)?)/i, category: "interest" },
    { pattern: /(?:working on|kaam kar raha|building)\s+(\w+(?:\s+\w+)?)/i, category: "project" },
    { pattern: /(?:mera name|call me|naam hai)\s+(\w+)/i, category: "preference" },
  ];

  for (const { pattern, category } of interestPatterns) {
    const match = lower.match(pattern);
    if (match) {
      return {
        category,
        key: category === "preference" ? "nickname" : "topic",
        value: match[1].trim(),
      };
    }
  }

  return null;
}
