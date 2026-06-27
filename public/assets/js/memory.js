/* ════════════════════════════════════════════════════════════════════════════
 * MEDULLA AI – MEMORY MODULE
 * Auto-extracts and manages user memories
 * GitHub Pages Compatible
 * ════════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════

function extractMemoryFromMessage(message) {
  const lower = message.toLowerCase();

  const patterns = [
    { regex: /(?:mujhe|main|i like|interested in|seekh raha|learning)\s+(\w+(?:\s+\w+)?)/i, category: "interest" },
    { regex: /(?:working on|kaam kar raha|building)\s+(\w+(?:\s+\w+)?)/i, category: "project" },
    { regex: /(?:mera name|call me|naam hai)\s+(\w+)/i, category: "name" },
    { regex: /(?:i am a|main ek|profession)\s+(\w+)/i, category: "profession" }
  ];

  for (const { regex, category } of patterns) {
    const match = message.match(regex);
    if (match) {
      return {
        title: category,
        content: match[1].trim()
      };
    }
  }

  return null;
}

async function autoSaveMemory(message) {
  const user = getCurrentUser();
  if (!user || !user.id) return;

  const memory = extractMemoryFromMessage(message);
  if (memory) {
    await saveMemory(user.id, memory.title, memory.content);
    console.log("💾 Memory saved:", memory);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

function formatMemoryItem(memory) {
  const title = memory.memory_title || memory.title || "Memory";
  const content = memory.memory_content || memory.content || "";
  
  return `
    <div class="memory-item" data-id="${memory.id}">
      <div class="memory-info">
        <div class="memory-category">${title}</div>
        <div class="memory-value">${content}</div>
      </div>
      <button class="memory-delete-btn" onclick="handleDeleteMemory('${memory.id}')">🗑️</button>
    </div>
  `;
}

async function handleDeleteMemory(memoryId) {
  await deleteMemoryById(memoryId);
  await loadAndDisplayMemories();
}
window.handleDeleteMemory = handleDeleteMemory;

async function loadAndDisplayMemories() {
  const memoryList = document.getElementById("memory-list");
  if (!memoryList) return;

  const user = getCurrentUser();
  let memories = [];

  if (user && user.id) {
    memories = await getUserMemories(user.id);
  }

  if (memories.length === 0) {
    memoryList.innerHTML = `
      <div class="memory-empty">
        🔮 No memories stored yet.<br>
        Start chatting and Medulla will learn about you!
      </div>
    `;
  } else {
    memoryList.innerHTML = memories.map(formatMemoryItem).join("");
  }
}

console.log("✅ Memory module loaded");
