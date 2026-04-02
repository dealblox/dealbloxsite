/**
 * LAG TECK — Utilitários e Funções Compartilhadas
 */

// ============================================================
//  AUTH UTILITIES
// ============================================================

const Auth = {
  STORAGE_KEY: "lagteck_user",

  /** Retorna usuário logado ou null */
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || null;
    } catch { return null; }
  },

  /** Salva usuário na sessão */
  setUser(userData) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent("lagteck:auth", { detail: userData }));
  },

  /** Faz logout */
  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("lagteck:auth", { detail: null }));
    window.location.href = "/";
  },

  /** Verifica se está logado */
  isLoggedIn() {
    return !!this.getUser();
  },

  /** Exige login, redireciona se não logado */
  requireLogin(redirectUrl = null) {
    if (!this.isLoggedIn()) {
      sessionStorage.setItem("lagteck_redirect", redirectUrl || window.location.href);
      showAuthModal();
      return false;
    }
    return true;
  },

  /** Hash simples (SHA-256 via Web Crypto API) */
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "lagteck_salt_2026");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  },

  /** Gera código de verificação de 6 dígitos */
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /** Gera ID único */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

// ============================================================
//  CART UTILITIES
// ============================================================

const Cart = {
  STORAGE_KEY: "lagteck_cart",

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch { return []; }
  },

  addItem(product) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this._notify();
    return items;
  },

  removeItem(productId) {
    const items = this.getItems().filter(i => i.id !== productId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this._notify();
    return items;
  },

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._notify();
  },

  getTotal() {
    return this.getItems().reduce((acc, i) => acc + (i.price * (i.qty || 1)), 0);
  },

  getCount() {
    return this.getItems().reduce((acc, i) => acc + (i.qty || 1), 0);
  },

  _notify() {
    window.dispatchEvent(new CustomEvent("lagteck:cart", { detail: this.getItems() }));
    updateCartBadge();
  }
};

// ============================================================
//  FAVORITES
// ============================================================

const Favorites = {
  STORAGE_KEY: "lagteck_favorites",

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch { return []; }
  },

  toggle(productId) {
    const items = this.getItems();
    const idx = items.indexOf(productId);
    if (idx >= 0) {
      items.splice(idx, 1);
    } else {
      items.push(productId);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items;
  },

  has(productId) {
    return this.getItems().includes(productId);
  }
};

// ============================================================
//  API HELPERS
// ============================================================

const API = {
  async get(table, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = `tables/${table}${qs ? "?" + qs : ""}`;
    const res = await fetch(url);
    return res.json();
  },

  async getOne(table, id) {
    const res = await fetch(`tables/${table}/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async post(table, data) {
    const res = await fetch(`tables/${table}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async put(table, id, data) {
    const res = await fetch(`tables/${table}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async patch(table, id, data) {
    const res = await fetch(`tables/${table}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async delete(table, id) {
    await fetch(`tables/${table}/${id}`, { method: "DELETE" });
  },

  /** Busca usuário por email */
  async findUserByEmail(email) {
    const res = await this.get("users", { search: email, limit: 10 });
    return res.data?.find(u => u.email === email) || null;
  }
};

// ============================================================
//  UI HELPERS
// ============================================================

/** Formata preço em BRL */
function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/** Mostra toast notification (estilo premium) */
function showToast(message, type = "success", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = "position:fixed;top:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="m10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };
  const borderColors = { success: "#10b981", error: "#ef4444", info: "#3b82f6", warning: "#f59e0b" };
  toast.style.cssText = `
    background:#0f1320;color:#c8d8f0;padding:14px 18px;
    border-radius:12px;font-size:13px;font-weight:600;
    box-shadow:0 8px 40px rgba(0,0,0,.6);
    display:flex;align-items:center;gap:10px;
    min-width:260px;max-width:380px;
    border:1px solid rgba(99,179,237,.15);
    border-left:4px solid ${borderColors[type]};
    animation:toastIn .3s ease both;
    pointer-events:all;
  `;
  toast.innerHTML = `
    <span style="flex-shrink:0">${icons[type] || icons.info}</span>
    <span style="flex:1;line-height:1.4">${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:#4a5568;padding:2px;font-size:16px;line-height:1;flex-shrink:0">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastOut .3s ease both";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/** Atualiza badge do carrinho */
function updateCartBadge() {
  const count = Cart.getCount();
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

/** Abre modal de autenticação */
function showAuthModal(tab = "login") {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (tab === "register" && typeof switchAuthTab === 'function') switchAuthTab('register');
    else if (tab === 'forgot' && typeof switchAuthTab === 'function') switchAuthTab('forgot');
  }
}

/** Fecha modal de autenticação */
function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

/** Renderiza estrelas */
function renderStars(count = 5) {
  return Array.from({ length: 5 }, (_, i) =>
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="${i < count ? '#f59e0b' : '#d1d5db'}">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>`
  ).join("");
}

/** Badge de raridade */
function rarityBadge(text) {
  const map = {
    "Mítica": "#8b5cf6",
    "Lendária": "#f59e0b",
    "Épica": "#3b82f6",
    "Rara": "#10b981",
    "Comum": "#6b7280",
  };
  for (const [key, color] of Object.entries(map)) {
    if (text.includes(key)) {
      return `<span style="background:${color};color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;letter-spacing:.5px;">${key.toUpperCase()}</span>`;
    }
  }
  return "";
}

// ============================================================
//  OAUTH — LOGIN COM GOOGLE E DISCORD
//  Fluxo: frontend redireciona → provider → auth-callback.html
//         callback chama /api/auth/google ou /api/auth/discord
//         backend troca code por dados do usuário (sem expor secrets)
// ============================================================

/**
 * Redireciona para o fluxo OAuth do Google.
 * O redirect_uri DEVE ser exatamente igual ao cadastrado no
 * Google Cloud Console (Authorized redirect URIs).
 *
 * Redirect URI a cadastrar:
 *   https://lagteck.xyz/auth-callback.html
 *   https://lagteck.vercel.app/auth-callback.html
 */
function loginGoogle() {
  const clientId = (typeof LAGTECK_CONFIG !== "undefined")
    ? LAGTECK_CONFIG.GOOGLE_CLIENT_ID
    : "";

  if (!clientId || clientId.includes("SEU_")) {
    showToast("Login com Google não configurado. Configure GOOGLE_CLIENT_ID.", "warning");
    return;
  }

  sessionStorage.setItem("lagteck_redirect", window.location.href);
  sessionStorage.setItem("oauth_state", "google");

  const redirectUri = window.location.origin + "/auth-callback.html";

  // Usa response_type=token (fluxo implícito) — funciona sem backend.
  // O auth-callback.html lê o access_token do hash e busca dados diretamente
  // no endpoint userinfo do Google (sem precisar de GOOGLE_CLIENT_SECRET).
  // Quando as Vercel Functions estiverem disponíveis, o callback tentará
  // o backend primeiro e só usará o fluxo implícito como fallback.
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id",     clientId);
  authUrl.searchParams.set("redirect_uri",  redirectUri);
  authUrl.searchParams.set("response_type", "token");
  authUrl.searchParams.set("scope",         "openid email profile");
  authUrl.searchParams.set("state",         "google");
  authUrl.searchParams.set("prompt",        "select_account");

  window.location.href = authUrl.toString();
}

/**
 * Redireciona para o fluxo OAuth do Discord.
 * O redirect_uri DEVE ser exatamente igual ao cadastrado em:
 * Discord Developer Portal → aplicação → OAuth2 → Redirects
 *
 * Redirect URI a cadastrar:
 *   https://lagteck.xyz/auth-callback.html
 *   https://lagteck.vercel.app/auth-callback.html
 */
function loginDiscord() {
  const clientId = (typeof LAGTECK_CONFIG !== "undefined")
    ? LAGTECK_CONFIG.DISCORD_CLIENT_ID
    : "";

  if (!clientId || clientId.includes("SEU_")) {
    showToast("Login com Discord não configurado. Configure DISCORD_CLIENT_ID.", "warning");
    return;
  }

  // Salva a página atual para redirecionar depois do login
  sessionStorage.setItem("lagteck_redirect", window.location.href);
  sessionStorage.setItem("oauth_state", "discord");

  const redirectUri = window.location.origin + "/auth-callback.html";

  const authUrl = new URL("https://discord.com/api/oauth2/authorize");
  authUrl.searchParams.set("client_id",     clientId);
  authUrl.searchParams.set("redirect_uri",  redirectUri);
  authUrl.searchParams.set("response_type", "code");
  // "identify email" — mínimo necessário para login
  authUrl.searchParams.set("scope",         "identify email");
  authUrl.searchParams.set("state",         "discord");
  authUrl.searchParams.set("prompt",        "consent");

  window.location.href = authUrl.toString();
}

// ── Listener: re-renderiza header/sidebar ao mudar auth ──────
window.addEventListener("lagteck:auth", () => {
  if (typeof renderHeader === "function") {
    const hr = document.getElementById("header-root");
    if (hr) hr.innerHTML = renderHeader();
    highlightActiveNav?.();
  }
  if (typeof renderSidebar === "function") {
    const sr = document.getElementById("sidebar-root");
    if (sr) sr.innerHTML = renderSidebar();
  }
  updateCartBadge();
});

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
