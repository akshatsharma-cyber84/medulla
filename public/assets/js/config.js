/* ════════════════════════════════════════════════════════════════════════════
 * MEDULLA AI – CONFIGURATION
 * GitHub Pages Compatible
 * All API endpoints and service configurations
 * ════════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // SUPABASE CONFIGURATION
  // Direct connection from frontend (safe - uses anon key)
  // ═══════════════════════════════════════════════════════════════════════════
  SUPABASE_URL: "https://zilotvwgpbkbmtakfevy.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_ClgIjvY7fBOgRYzlIDMizA_09orBu26",

  // ═══════════════════════════════════════════════════════════════════════════
  // GPT API PROXY CONFIGURATION
  // ⚠️ IMPORTANT: Never expose OpenAI API keys in frontend!
  // Set this to your secure backend proxy URL
  // Options: Vercel Edge Function, Cloudflare Worker, Netlify Function
  // ═══════════════════════════════════════════════════════════════════════════
  GPT_API_ENABLED: false,  // Set to true when backend is deployed
  GPT_API_ENDPOINT: "",    // Your proxy URL: "https://your-proxy.vercel.app/api/chat"
  
  // Fallback: Use internal knowledge base when GPT is disabled/unavailable
  USE_INTERNAL_KB: true,

  // ═══════════════════════════════════════════════════════════════════════════
  // FORMSPREE CONFIGURATION
  // For new user registration notifications
  // ═══════════════════════════════════════════════════════════════════════════
  FORMSPREE_ENDPOINT: "https://formspree.io/f/xgobnrbj",

  // ═══════════════════════════════════════════════════════════════════════════
  // AK INDUSTRIES LINKS
  // ═══════════════════════════════════════════════════════════════════════════
  AK_INDUSTRIES_URL: "https://akshatsharma-cyber84.github.io/AK_world",
  AK_CONTACT_URL: "https://akshatsharma-cyber84.github.io/AK_world/#contact",

  // ═══════════════════════════════════════════════════════════════════════════
  // APP SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  APP_NAME: "Medulla AI",
  APP_VERSION: "2.0",
  DEVELOPER: "AK Industries"
};

// Freeze to prevent modification
Object.freeze(CONFIG);

console.log("✅ Medulla AI Config Loaded");
console.log("   GPT API:", CONFIG.GPT_API_ENABLED ? "Enabled" : "Disabled (using internal KB)");
