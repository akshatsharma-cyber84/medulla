/* ════════════════════════════════════════════════════════════════════════════
 * MEDULLA AI – MAIN APPLICATION CONTROLLER
 * Orchestrates all modules and UI
 * GitHub Pages Compatible
 * ════════════════════════════════════════════════════════════════════════════ */

// Application state
let appState = "loading";
let mousePosition = { x: 0, y: 0 };

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", function() {
  console.log("🧠 Medulla AI Starting...");
  
  // Initialize Supabase
  initSupabase();
  
  // Setup event listeners
  setupEventListeners();
  
  // Create particles
  createParticles();
  
  // Start loading
  startLoading();
});

// ═══════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
  // Mouse tracking
  document.addEventListener("mousemove", function(e) {
    mousePosition = { x: e.clientX, y: e.clientY };
    updateGlow();
  });

  // Login
  document.getElementById("login-btn")?.addEventListener("click", handleLoginClick);
  document.getElementById("name-input")?.addEventListener("keydown", e => e.key === "Enter" && handleLoginClick());
  document.getElementById("phone-input")?.addEventListener("keydown", e => e.key === "Enter" && handleLoginClick());

  // Chat
  const chatInput = document.getElementById("chat-input");
  chatInput?.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  chatInput?.addEventListener("input", autoResize);
  
  document.getElementById("send-btn")?.addEventListener("click", handleSendMessage);
  document.getElementById("new-chat-btn")?.addEventListener("click", handleNewChat);

  // Mobile menu
  document.getElementById("mobile-menu-btn")?.addEventListener("click", toggleSidebar);
  document.getElementById("sidebar-overlay")?.addEventListener("click", closeSidebar);

  // Modals
  document.getElementById("about-btn")?.addEventListener("click", () => openModal("about-modal"));
  document.getElementById("settings-btn")?.addEventListener("click", () => { openModal("settings-modal"); updateSettingsInfo(); });
  document.getElementById("memory-btn")?.addEventListener("click", () => { openModal("memory-modal"); loadAndDisplayMemories(); });

  // Modal close
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", closeAllModals);
  });
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) closeAllModals();
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADING
// ═══════════════════════════════════════════════════════════════════════════

function startLoading() {
  let progress = 0;
  const bar = document.getElementById("progress-bar");
  
  const interval = setInterval(function() {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      bar.style.width = "100%";
      clearInterval(interval);
      setTimeout(showLogin, 600);
    } else {
      bar.style.width = progress + "%";
    }
  }, 150);
}

function showLogin() {
  appState = "login";
  document.getElementById("loading-screen")?.classList.add("hidden");
  document.getElementById("login-screen")?.classList.remove("hidden");
}

function showChat() {
  appState = "chat";
  document.getElementById("login-screen")?.classList.add("hidden");
  document.getElementById("app-wrapper")?.classList.add("active");
  
  startNewChat();
  loadChatHistory();
  updateWelcome();
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════════

async function handleLoginClick() {
  const nameInput = document.getElementById("name-input");
  const phoneInput = document.getElementById("phone-input");
  const loginBtn = document.getElementById("login-btn");
  const errorDiv = document.getElementById("login-error");

  const name = nameInput?.value?.trim() || "";
  const phone = phoneInput?.value?.trim() || "";

  if (!name || !phone) {
    errorDiv.textContent = "Please enter name and phone number";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Connecting...";
  errorDiv.textContent = "";

  try {
    const result = await handleLogin(name, phone);
    if (result.success) {
      showChat();
    } else {
      errorDiv.textContent = result.error || "Login failed";
    }
  } catch (err) {
    showChat(); // Allow access on error
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "🚀 Continue to Medulla AI";
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAT
// ═══════════════════════════════════════════════════════════════════════════

async function handleSendMessage() {
  const input = document.getElementById("chat-input");
  const message = input?.value?.trim();
  if (!message) return;

  input.value = "";
  input.style.height = "52px";
  
  document.getElementById("welcome-screen")?.classList.add("hidden");
  
  addMessageToUI("user", message);
  showTyping();
  
  setTimeout(async function() {
    try {
      const response = await sendMessage(message);
      hideTyping();
      addMessageToUI("assistant", response.content);
      
      // Auto-save memory
      autoSaveMemory(message);
      
      // Update history
      loadChatHistory();
    } catch (err) {
      hideTyping();
      addMessageToUI("assistant", "Oops! Kuch gadbad ho gayi. Try again! 🔧");
    }
    scrollToBottom();
  }, 400 + Math.random() * 800);
}

function addMessageToUI(role, content) {
  const container = document.getElementById("chat-messages");
  if (!container) return;

  const user = getCurrentUser();
  const name = role === "user" ? (user?.name || "You") : "Medulla AI";
  const icon = role === "user" ? "👤" : "🧠";
  const time = formatTime(new Date());

  const html = `
    <div class="message-group">
      <div class="message-label ${role}">
        <span class="message-label-icon">${icon}</span>
        ${name}
      </div>
      <div class="message-bubble ${role}">
        ${renderMarkdown(content)}
      </div>
      <div class="message-time ${role}">${time}</div>
    </div>
  `;

  const typing = document.getElementById("typing-indicator");
  if (typing) {
    typing.insertAdjacentHTML("beforebegin", html);
  } else {
    container.insertAdjacentHTML("beforeend", html);
  }

  scrollToBottom();
}

function showTyping() {
  document.getElementById("typing-indicator")?.classList.add("visible");
}

function hideTyping() {
  document.getElementById("typing-indicator")?.classList.remove("visible");
}

function scrollToBottom() {
  const container = document.getElementById("chat-messages");
  if (container) container.scrollTop = container.scrollHeight;
}

function handleNewChat() {
  startNewChat();
  
  const container = document.getElementById("chat-messages");
  const welcome = document.getElementById("welcome-screen");
  const typing = document.getElementById("typing-indicator");
  
  if (container) {
    container.innerHTML = "";
    if (welcome) {
      welcome.classList.remove("hidden");
      container.appendChild(welcome);
    }
    if (typing) container.appendChild(typing);
  }
  
  loadChatHistory();
  closeSidebar();
}

function loadChatHistory() {
  const container = document.getElementById("chat-history");
  if (!container) return;

  const sessions = getChatSessions();

  if (sessions.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted);font-size:13px;padding:12px;text-align:center;">No previous chats</div>`;
    return;
  }

  container.innerHTML = sessions.map(s => `
    <div class="history-item ${s.id === currentSessionId ? 'active' : ''}" data-id="${s.id}">
      <span class="history-item-text">💬 ${s.title}</span>
      <button class="history-delete" onclick="handleDeleteSession('${s.id}', event)">×</button>
    </div>
  `).join("");

  container.querySelectorAll(".history-item").forEach(item => {
    item.addEventListener("click", function(e) {
      if (e.target.classList.contains("history-delete")) return;
      loadSessionUI(this.dataset.id);
    });
  });
}

function loadSessionUI(sessionId) {
  const messages = loadChatSession(sessionId);
  const container = document.getElementById("chat-messages");
  const welcome = document.getElementById("welcome-screen");
  const typing = document.getElementById("typing-indicator");
  
  if (container) {
    container.innerHTML = "";
    if (welcome) welcome.classList.add("hidden");
    messages.forEach(m => addMessageToUI(m.role, m.content));
    if (typing) container.appendChild(typing);
  }
  
  document.querySelectorAll(".history-item").forEach(item => {
    item.classList.toggle("active", item.dataset.id === sessionId);
  });
  
  closeSidebar();
}

function handleDeleteSession(id, e) {
  e.stopPropagation();
  deleteChatSession(id);
  loadChatHistory();
}
window.handleDeleteSession = handleDeleteSession;

// ═══════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function updateWelcome() {
  const user = getCurrentUser();
  const title = document.getElementById("welcome-title");
  const text = document.getElementById("welcome-text");
  const badge = document.getElementById("welcome-badge");
  
  if (title) {
    title.textContent = user.isNewUser
      ? `Welcome to Medulla AI, ${user.name || "Friend"}!`
      : `Welcome back, ${user.name}!`;
  }
  
  if (text) {
    text.textContent = user.isNewUser
      ? "Main hoon tumhara AI buddy! Tech, coding, cybersecurity, ya kuch bhi poochho — Hinglish mein help karunga. 🚀"
      : "Good to see you again! Kya help chahiye aaj? 🎯";
  }
  
  if (badge) {
    badge.style.display = user.isNewUser ? "none" : "inline-block";
  }
}

function updateSettingsInfo() {
  const info = document.getElementById("settings-user-info");
  if (info) {
    const user = getCurrentUser();
    info.innerHTML = `
      <strong>Name:</strong> ${user.name || "Guest"}<br>
      <strong>Status:</strong> ${user.isNewUser ? "New User" : "Returning User"}<br>
      <strong>GPT API:</strong> ${CONFIG.GPT_API_ENABLED ? "Enabled" : "Disabled"}
    `;
  }
}

function updateGlow() {
  const glow = document.getElementById("glow-light");
  if (glow) {
    glow.style.left = mousePosition.x + "px";
    glow.style.top = mousePosition.y + "px";
  }
}

function autoResize(e) {
  e.target.style.height = "52px";
  e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
}

function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("open");
  document.getElementById("sidebar-overlay")?.classList.toggle("active");
}

function closeSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
  document.getElementById("sidebar-overlay")?.classList.remove("active");
}

function openModal(id) {
  closeAllModals();
  document.getElementById(id)?.classList.add("active");
  closeSidebar();
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════════════════════════════════════

function createParticles() {
  const container = document.getElementById("particles-container");
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    const size = Math.random() * 2.5 + 1;
    p.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:rgba(255,255,255,${Math.random()*0.5+0.2});
      border-radius:50%;
      top:${Math.random()*100}%;left:${Math.random()*100}%;
      animation:twinkle ${Math.random()*4+3}s ease-in-out infinite;
      animation-delay:${Math.random()*4}s;
      pointer-events:none;
    `;
    container.appendChild(p);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SUGGESTION HANDLER
// ═══════════════════════════════════════════════════════════════════════════

function handleSuggestion(text) {
  const input = document.getElementById("chat-input");
  if (input) {
    input.value = text;
    input.focus();
  }
}
window.handleSuggestion = handleSuggestion;

console.log("✅ Medulla AI Ready!");
