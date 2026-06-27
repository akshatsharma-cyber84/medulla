/* ════════════════════════════════════════════════════════════════════════════
 * MEDULLA AI – AUTHENTICATION MODULE
 * Handles login, registration, Formspree, admin detection
 * GitHub Pages Compatible
 * ════════════════════════════════════════════════════════════════════════════ */

// Admin identifier (handled silently, never exposed in UI)
const ADMIN_IDENTIFIER = "8601264402";

// Current user state
let currentUser = {
  id: null,
  name: "",
  phone: "",
  isAdmin: false,
  isNewUser: true,
  preferences: [],
  memories: []
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN LOGIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════

async function handleLogin(name, phone) {
  const trimmedName = String(name).trim();
  const trimmedPhone = String(phone).trim();

  if (!trimmedName || !trimmedPhone) {
    return { success: false, error: "Name and phone number required" };
  }

  const isAdmin = trimmedPhone === ADMIN_IDENTIFIER;

  try {
    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN PATH - Bypass everything, open immediately
    // ═══════════════════════════════════════════════════════════════════════
    if (isAdmin) {
      currentUser = {
        id: "admin_0",
        name: trimmedName,
        phone: trimmedPhone,
        isAdmin: true,
        isNewUser: false,
        preferences: [],
        memories: []
      };
      saveUserSession(currentUser);
      return { success: true, user: currentUser, isNewUser: false };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CHECK SUPABASE FOR EXISTING USER
    // ═══════════════════════════════════════════════════════════════════════
    let existingUser = null;
    
    if (isSupabaseReady()) {
      existingUser = await getUserByPhone(trimmedPhone);
    } else {
      // Fallback to local storage
      existingUser = getUserLocallyByPhone(trimmedPhone);
    }

    if (existingUser) {
      // ─────────────────────────────────────────────────────────────────────
      // RETURNING USER - Load profile, skip Formspree
      // ─────────────────────────────────────────────────────────────────────
      await updateLastLogin(existingUser.id);
      
      const preferences = await getUserPreferences(existingUser.id);
      const memories = await getUserMemories(existingUser.id);

      currentUser = {
        id: existingUser.id,
        name: existingUser.name,
        phone: existingUser.phone_number,
        isAdmin: existingUser.is_admin || false,
        isNewUser: false,
        preferences: preferences,
        memories: memories
      };

      saveUserSession(currentUser);
      console.log("✅ Returning user recognized:", currentUser.name);
      return { success: true, user: currentUser, isNewUser: false };

    } else {
      // ─────────────────────────────────────────────────────────────────────
      // NEW USER - Register + Formspree
      // ─────────────────────────────────────────────────────────────────────
      const newUser = await createUser(trimmedName, trimmedPhone, false);

      // Send Formspree notification (fire and forget)
      sendFormspreeNotification(trimmedName, trimmedPhone);

      currentUser = {
        id: newUser ? newUser.id : "local_" + Date.now(),
        name: trimmedName,
        phone: trimmedPhone,
        isAdmin: false,
        isNewUser: true,
        preferences: [],
        memories: []
      };

      saveUserSession(currentUser);
      console.log("✅ New user registered:", currentUser.name);
      return { success: true, user: currentUser, isNewUser: true };
    }

  } catch (error) {
    console.error("Login error:", error);
    
    // Fallback: Allow access even on error
    currentUser = {
      id: "guest_" + Date.now(),
      name: trimmedName,
      phone: trimmedPhone,
      isAdmin: isAdmin,
      isNewUser: true,
      preferences: [],
      memories: []
    };
    saveUserSession(currentUser);
    return { success: true, user: currentUser, isNewUser: true };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FORMSPREE SUBMISSION (New users only)
// ═══════════════════════════════════════════════════════════════════════════

async function sendFormspreeNotification(name, phone) {
  try {
    const response = await fetch(CONFIG.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        timestamp: new Date().toISOString(),
        source: "Medulla AI - New Registration",
        userAgent: navigator.userAgent
      })
    });
    
    if (response.ok) {
      console.log("✅ Formspree notification sent");
    }
  } catch (error) {
    console.warn("Formspree error (non-blocking):", error);
    // Don't block user access
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

function saveUserSession(user) {
  try {
    localStorage.setItem("medulla_session", JSON.stringify({
      id: user.id,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
      savedAt: new Date().toISOString()
    }));
  } catch (err) {}
}

function loadUserSession() {
  try {
    const session = localStorage.getItem("medulla_session");
    return session ? JSON.parse(session) : null;
  } catch (err) { return null; }
}

function clearUserSession() {
  try {
    localStorage.removeItem("medulla_session");
    currentUser = {
      id: null,
      name: "",
      phone: "",
      isAdmin: false,
      isNewUser: true,
      preferences: [],
      memories: []
    };
  } catch (err) {}
}

function getCurrentUser() {
  return currentUser;
}

function isLoggedIn() {
  return currentUser.id !== null;
}

console.log("✅ Auth module loaded");
