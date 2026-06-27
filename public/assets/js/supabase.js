/* ════════════════════════════════════════════════════════════════════════════
 * MEDULLA AI – SUPABASE CLIENT
 * Direct database connection for users, memory, preferences
 * GitHub Pages Compatible (uses Supabase JS CDN)
 * ════════════════════════════════════════════════════════════════════════════ */

let supabaseClient = null;

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

function initSupabase() {
  try {
    if (typeof supabase !== "undefined" && supabase.createClient) {
      supabaseClient = supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_ANON_KEY
      );
      console.log("✅ Supabase connected");
      return true;
    } else {
      console.warn("⚠️ Supabase SDK not loaded, using local storage fallback");
      return false;
    }
  } catch (err) {
    console.error("❌ Supabase init error:", err);
    return false;
  }
}

function isSupabaseReady() {
  return supabaseClient !== null;
}

// ═══════════════════════════════════════════════════════════════════════════
// USER OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if user exists by phone number
 */
async function getUserByPhone(phone) {
  if (!isSupabaseReady()) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("phone_number", phone)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("getUserByPhone error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("getUserByPhone exception:", err);
    return null;
  }
}

/**
 * Create new user
 */
async function createUser(name, phone, isAdmin = false) {
  if (!isSupabaseReady()) {
    // Fallback: store locally
    return createUserLocally(name, phone, isAdmin);
  }
  
  try {
    const { data, error } = await supabaseClient
      .from("users")
      .insert([{
        name: name,
        phone_number: phone,
        is_admin: isAdmin,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("createUser error:", error);
      return createUserLocally(name, phone, isAdmin);
    }
    return data;
  } catch (err) {
    console.error("createUser exception:", err);
    return createUserLocally(name, phone, isAdmin);
  }
}

/**
 * Update last login timestamp
 */
async function updateLastLogin(userId) {
  if (!isSupabaseReady()) return;
  
  try {
    await supabaseClient
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", userId);
  } catch (err) {
    console.error("updateLastLogin error:", err);
  }
}

/**
 * Local fallback for user creation
 */
function createUserLocally(name, phone, isAdmin) {
  const user = {
    id: "local_" + Date.now(),
    name: name,
    phone_number: phone,
    is_admin: isAdmin,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  };
  
  try {
    const users = JSON.parse(localStorage.getItem("medulla_users") || "[]");
    users.push(user);
    localStorage.setItem("medulla_users", JSON.stringify(users));
  } catch (e) {
    console.error("Local storage error:", e);
  }
  
  return user;
}

/**
 * Get user from local storage
 */
function getUserLocallyByPhone(phone) {
  try {
    const users = JSON.parse(localStorage.getItem("medulla_users") || "[]");
    return users.find(u => u.phone_number === phone) || null;
  } catch (e) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PREFERENCES OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

async function getUserPreferences(userId) {
  if (!isSupabaseReady()) return getPreferencesLocally(userId);
  
  try {
    const { data, error } = await supabaseClient
      .from("preferences")
      .select("*")
      .eq("user_id", userId);

    if (error) return getPreferencesLocally(userId);
    return data || [];
  } catch (err) {
    return getPreferencesLocally(userId);
  }
}

async function setUserPreference(userId, key, value) {
  if (!isSupabaseReady()) {
    setPreferenceLocally(userId, key, value);
    return;
  }
  
  try {
    const { data: existing } = await supabaseClient
      .from("preferences")
      .select("id")
      .eq("user_id", userId)
      .eq("preference_key", key)
      .single();

    if (existing) {
      await supabaseClient
        .from("preferences")
        .update({ preference_value: value })
        .eq("id", existing.id);
    } else {
      await supabaseClient
        .from("preferences")
        .insert([{ user_id: userId, preference_key: key, preference_value: value }]);
    }
  } catch (err) {
    setPreferenceLocally(userId, key, value);
  }
}

function getPreferencesLocally(userId) {
  try {
    const prefs = JSON.parse(localStorage.getItem("medulla_prefs_" + userId) || "[]");
    return prefs;
  } catch (e) { return []; }
}

function setPreferenceLocally(userId, key, value) {
  try {
    let prefs = JSON.parse(localStorage.getItem("medulla_prefs_" + userId) || "[]");
    const idx = prefs.findIndex(p => p.preference_key === key);
    if (idx >= 0) {
      prefs[idx].preference_value = value;
    } else {
      prefs.push({ preference_key: key, preference_value: value });
    }
    localStorage.setItem("medulla_prefs_" + userId, JSON.stringify(prefs));
  } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

async function getUserMemories(userId) {
  if (!isSupabaseReady()) return getMemoriesLocally(userId);
  
  try {
    const { data, error } = await supabaseClient
      .from("memory")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return getMemoriesLocally(userId);
    return data || [];
  } catch (err) {
    return getMemoriesLocally(userId);
  }
}

async function saveMemory(userId, title, content) {
  if (!isSupabaseReady()) {
    saveMemoryLocally(userId, title, content);
    return;
  }
  
  try {
    await supabaseClient
      .from("memory")
      .insert([{
        user_id: userId,
        memory_title: title,
        memory_content: content,
        created_at: new Date().toISOString()
      }]);
  } catch (err) {
    saveMemoryLocally(userId, title, content);
  }
}

async function deleteMemoryById(memoryId) {
  if (!isSupabaseReady() || String(memoryId).startsWith("local_")) {
    deleteMemoryLocally(memoryId);
    return;
  }
  
  try {
    await supabaseClient.from("memory").delete().eq("id", memoryId);
  } catch (err) {
    console.error("deleteMemory error:", err);
  }
}

function getMemoriesLocally(userId) {
  try {
    return JSON.parse(localStorage.getItem("medulla_memory_" + userId) || "[]");
  } catch (e) { return []; }
}

function saveMemoryLocally(userId, title, content) {
  try {
    let mems = JSON.parse(localStorage.getItem("medulla_memory_" + userId) || "[]");
    mems.unshift({
      id: "local_" + Date.now(),
      memory_title: title,
      memory_content: content,
      created_at: new Date().toISOString()
    });
    localStorage.setItem("medulla_memory_" + userId, JSON.stringify(mems));
  } catch (e) {}
}

function deleteMemoryLocally(memoryId) {
  // Search all user memory stores
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("medulla_memory_")) {
      try {
        let mems = JSON.parse(localStorage.getItem(key) || "[]");
        mems = mems.filter(m => m.id !== memoryId);
        localStorage.setItem(key, JSON.stringify(mems));
      } catch (e) {}
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAT HISTORY (Local Storage)
// ═══════════════════════════════════════════════════════════════════════════

function saveChatLocally(sessionId, messages) {
  try {
    const chats = JSON.parse(localStorage.getItem("medulla_chats") || "{}");
    chats[sessionId] = {
      messages: messages,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem("medulla_chats", JSON.stringify(chats));
  } catch (err) {}
}

function loadChatsLocally() {
  try {
    return JSON.parse(localStorage.getItem("medulla_chats") || "{}");
  } catch (err) { return {}; }
}

function deleteChatLocally(sessionId) {
  try {
    const chats = JSON.parse(localStorage.getItem("medulla_chats") || "{}");
    delete chats[sessionId];
    localStorage.setItem("medulla_chats", JSON.stringify(chats));
  } catch (err) {}
}

console.log("✅ Supabase module loaded");
