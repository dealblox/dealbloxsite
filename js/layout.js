/**
 * LAG TECK — Layout Components (Dark Mode Premium)
 * Header, Topbar, Sidebar, Footer, MobileNav, AuthModal
 */

// ============================================================
//  TOPBAR
// ============================================================
function renderTopbar() {
  return `
  <div class="topbar">
    <span class="topbar-dot"></span>
    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    Entrega <strong>rápida e segura</strong> via Discord &nbsp;·&nbsp;
    <a href="https://discord.gg/rPFN7BMC5k" target="_blank">Entrar no servidor ✨</a>
    &nbsp;·&nbsp;
    <span style="opacity:.7">🔒 Pagamento pelo Mercado Pago</span>
  </div>`;
}

// ============================================================
//  HEADER
// ============================================================
function renderHeader() {
  const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
  const cartCount = typeof Cart !== 'undefined' ? Cart.getCount() : 0;

  return `
  <header class="site-header">
    <div class="header-inner">
      <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Abrir menu">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <a href="/" class="logo">
        <img src="/images/logo-lagteck.png" alt="Deal Blox" style="width:36px;height:36px;border-radius:8px;object-fit:cover;box-shadow:0 0 12px rgba(239,68,68,.35);flex-shrink:0">
        <span class="logo-text">Deal Blox</span>
      </a>

      <nav class="header-nav">
        <a href="/contas.html" id="nav-contas">Contas</a>
        <a href="/frutas.html" id="nav-frutas">Frutas</a>
        <a href="/gamepass.html" id="nav-gamepass">Gamepass</a>
        <a href="/executor.html" id="nav-executor">Executor</a>
        <a href="/scripts.html" id="nav-scripts">Scripts</a>

      </nav>

      <div class="header-search">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" id="header-search-input" placeholder="Buscar produtos..." autocomplete="off">
      </div>

      <div class="header-actions">
        ${user ? `
          <a href="/favoritos.html" class="header-btn" title="Favoritos">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </a>
          <a href="/mensagens.html" class="header-btn" title="Mensagens">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </a>
          <a href="/carrinho.html" class="header-btn" title="Carrinho" style="position:relative">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span class="cart-badge" style="display:${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
          </a>
          <a href="/perfil.html" class="header-btn" title="${user.full_name}" style="padding:3px">
            <div class="sidebar-avatar" style="width:28px;height:28px;font-size:12px;border-radius:6px">
              ${user.avatar_url ? `<img src="${user.avatar_url}" alt="${user.full_name}">` : (user.full_name?.[0] || 'U').toUpperCase()}
            </div>
          </a>
        ` : `
          <a href="/carrinho.html" class="header-btn" title="Carrinho" style="position:relative">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span class="cart-badge" style="display:${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
          </a>
          <button class="btn-login" onclick="showAuthModal('login')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Entrar
          </button>
        `}
      </div>
    </div>
  </header>`;
}

// ============================================================
//  SIDEBAR
// ============================================================
function renderSidebar(activePage = "") {
  const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;

  const pages = [
    { href: "/", id: "inicio", label: "Início", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
    { href: "/contas.html", id: "contas", label: "Contas Blox", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
    { href: "/frutas.html", id: "frutas", label: "Frutas", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
    { href: "/gamepass.html", id: "gamepass", label: "Gamepass", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`, soon: true },
    { href: "/executor.html", id: "executor", label: "Executor", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
    { href: "/scripts.html", id: "scripts", label: "Scripts", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>` },
  ];

  const otherPages = [
    { href: "/jornalzinho.html", id: "jornalzinho", label: "Jornalzinho", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>` },
  ];

  const userPages = user ? [
    { href: "/perfil.html", id: "perfil", label: "Meu Perfil", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
    { href: "/mensagens.html", id: "mensagens", label: "Mensagens", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
    { href: "/favoritos.html", id: "favoritos", label: "Favoritos", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
    { href: "/carrinho.html", id: "carrinho", label: "Carrinho", icon: `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>` },
  ] : [];

  return `
  <aside class="sidebar">
    <span class="sidebar-section-label">Loja</span>
    ${pages.map(p => `
      <a href="${p.href}" class="sidebar-item ${activePage === p.id ? 'active' : ''}">
        ${p.icon}
        ${p.label}
        ${p.soon ? '<span class="sidebar-badge-em-breve">EM BREVE</span>' : ''}
      </a>
    `).join('')}

    <span class="sidebar-section-label">Outros</span>
    ${otherPages.map(p => `
      <a href="${p.href}" class="sidebar-item ${activePage === p.id ? 'active' : ''}">
        ${p.icon}
        ${p.label}
        ${p.soon ? '<span class="sidebar-badge-em-breve">EM BREVE</span>' : ''}
      </a>
    `).join('')}

    ${user ? `
    <span class="sidebar-section-label">Minha Conta</span>
    ${userPages.map(p => `
      <a href="${p.href}" class="sidebar-item ${activePage === p.id ? 'active' : ''}">
        ${p.icon} ${p.label}
      </a>
    `).join('')}
    <button class="sidebar-item" onclick="Auth.logout()" style="width:100%;border:none;background:none;text-align:left;color:var(--red);cursor:pointer;font-family:var(--font)">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Sair
    </button>
    <div class="sidebar-user">
      <div class="sidebar-user-info">
        <div class="sidebar-avatar">
          ${user.avatar_url ? `<img src="${user.avatar_url}" alt="${user.full_name}">` : (user.full_name?.[0] || 'U').toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <div class="sidebar-user-name">${user.full_name?.split(' ')[0] || 'Usuário'}</div>
          <div class="sidebar-user-email" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${user.email}</div>
        </div>
      </div>
    </div>
    ` : `
    <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px">
      <button onclick="showAuthModal('login')" class="btn-login" style="width:100%;justify-content:center;border-radius:var(--r)">Entrar na conta</button>
      <button onclick="showAuthModal('register')" style="background:transparent;color:var(--cyan2);border:1px solid rgba(6,182,212,.3);border-radius:var(--r);padding:8px;font-size:12px;font-weight:700;font-family:var(--font)">Criar conta grátis</button>
    </div>
    `}
  </aside>`;
}

// ============================================================
//  MOBILE NAV
// ============================================================
function renderMobileNav(activePage = "") {
  const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
  return `
  <div class="mobile-nav-overlay" id="mobile-nav-overlay" onclick="closeMobileNav()">
  </div>
  <div class="mobile-nav" id="mobile-nav">
    <div class="mobile-nav-header">
      <a href="/" class="logo">
        <img src="/images/logo-lagteck.png" alt="Deal Blox" style="width:32px;height:32px;border-radius:8px;object-fit:cover;flex-shrink:0">
        <span class="logo-text" style="font-size:17px">Deal Blox</span>
      </a>
      <button class="mobile-nav-close" onclick="closeMobileNav()">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    ${user ? `
    <div class="mobile-nav-user">
      <div class="sidebar-avatar">
        ${user.avatar_url ? `<img src="${user.avatar_url}" alt="${user.full_name}">` : (user.full_name?.[0] || 'U').toUpperCase()}
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:800;color:var(--white)">${user.full_name?.split(' ')[0]}</div>
        <div style="font-size:11px;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${user.email}</div>
      </div>
    </div>
    ` : ''}

    <span class="mobile-nav-section-label">Loja</span>
    <a href="/" class="mobile-nav-item ${activePage === 'inicio' ? 'active' : ''}">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      Início
    </a>
    <a href="/contas.html" class="mobile-nav-item ${activePage === 'contas' ? 'active' : ''}">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      Contas Blox
    </a>
    <a href="/frutas.html" class="mobile-nav-item ${activePage === 'frutas' ? 'active' : ''}">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Frutas
    </a>
    <a href="/gamepass.html" class="mobile-nav-item">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      Gamepass <span class="sidebar-badge-em-breve">EM BREVE</span>
    </a>
    <a href="/executor.html" class="mobile-nav-item">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      Executor
    </a>
    <a href="/scripts.html" class="mobile-nav-item">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      Scripts
    </a>
    <span class="mobile-nav-section-label">Outros</span>
    <a href="/jornalzinho.html" class="mobile-nav-item">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>
      Jornalzinho
    </a>

    ${user ? `
    <span class="mobile-nav-section-label">Minha Conta</span>
    <a href="/perfil.html" class="mobile-nav-item">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      Meu Perfil
    </a>
    <a href="/favoritos.html" class="mobile-nav-item">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      Favoritos
    </a>
    <a href="/carrinho.html" class="mobile-nav-item">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      Carrinho
    </a>
    <button class="mobile-nav-item" onclick="Auth.logout()" style="width:100%;border:none;background:none;text-align:left;color:var(--red);cursor:pointer;font-family:var(--font)">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Sair da conta
    </button>
    ` : `
    <div class="mobile-nav-btns">
      <button onclick="showAuthModal('login');closeMobileNav()" class="btn-mobile-login">🔑 Entrar na conta</button>
      <button onclick="showAuthModal('register');closeMobileNav()" class="btn-mobile-register">✨ Criar conta grátis</button>
    </div>
    `}

    <div style="margin-top:auto;padding-top:16px;padding-bottom:8px">
      <a href="https://discord.gg/rPFN7BMC5k" target="_blank" style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(88,101,242,.12);border:1px solid rgba(88,101,242,.25);border-radius:var(--r);color:#7289da;font-size:13px;font-weight:700;text-decoration:none">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
        Servidor Discord
      </a>
    </div>
  </div>`;
}

// ============================================================
//  FOOTER
// ============================================================
function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="logo" style="margin-bottom:14px;display:inline-flex">
            <img src="/images/logo-lagteck.png" alt="Deal Blox" style="width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0">
            <span class="logo-text">Deal Blox</span>
          </a>
          <p>Loja digital de Blox Fruits. Contas upadas, frutas raras e mais — entrega rápida e suporte via Discord.</p>
          <div class="footer-social">
            <a href="https://discord.gg/rPFN7BMC5k" target="_blank" class="footer-social-btn" title="Discord">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            </a>
            <a href="mailto:lagteck@gmail.com" class="footer-social-btn" title="Email">
              <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Produtos</h4>
          <ul>
            <li><a href="/contas.html">Contas Blox Fruits</a></li>
            <li><a href="/frutas.html">Frutas</a></li>
            <li><a href="/gamepass.html">Gamepass</a></li>
            <li><a href="/executor.html">Executor</a></li>
            <li><a href="/scripts.html">Scripts</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Suporte</h4>
          <ul>
            <li><a href="/faq.html">Perguntas Frequentes</a></li>
            <li><a href="https://discord.gg/rPFN7BMC5k" target="_blank">Servidor Discord</a></li>
            <li><a href="mailto:lagteck@gmail.com">lagteck@gmail.com</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Institucional</h4>
          <ul>
            <li><a href="/termos.html">Termos de Serviço</a></li>
            <li><a href="/privacidade.html">Privacidade</a></li>
            <li><a href="/faq.html">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copy">© ${new Date().getFullYear()} Deal Blox. Todos os direitos reservados. Não afiliado à Roblox Corporation.</p>
        <div class="footer-payments">
          <span style="color:var(--text3);font-size:11px;font-weight:600">Pagamentos:</span>
          <span class="payment-icon">PIX</span>
          <span class="payment-icon">Crédito</span>
          <span class="payment-icon">Débito</span>
        </div>
      </div>
    </div>
  </footer>`;
}

// ============================================================
//  AUTH MODAL
// ============================================================
function renderAuthModal() {
  return `
  <div class="modal-overlay" id="auth-modal" style="display:none">
    <div class="modal-box">
      <button class="modal-close" onclick="closeAuthModal()">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div class="auth-modal-logo">
        <div class="logo-icon" style="background:transparent;box-shadow:none;padding:0">
          <img src="/images/logo-lagteck.png" alt="Deal Blox" style="width:36px;height:36px;border-radius:10px;object-fit:cover;display:block;box-shadow:0 0 14px rgba(239,68,68,.4)">
        </div>
        <span>Deal Blox</span>
      </div>
      <p style="font-size:13px;color:var(--text2);margin-bottom:20px">Sua loja de Blox Fruits</p>

      <div class="auth-tabs">
        <button class="auth-tab active" id="auth-tab-login" onclick="switchAuthTab('login')">Entrar</button>
        <button class="auth-tab" id="auth-tab-register" onclick="switchAuthTab('register')">Criar conta</button>
      </div>

      <!-- LOGIN -->
      <div id="auth-panel-login">
        <form onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="login-email" placeholder="seu@email.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" class="form-input" id="login-password" placeholder="••••••••" required>
          </div>
          <div class="form-forgot">
            <a href="#" onclick="switchAuthTab('forgot');return false">Esqueci minha senha</a>
          </div>
          <button type="submit" class="btn-auth-submit" id="btn-login-submit">Acessar minha conta</button>
        </form>
        <div class="auth-divider">ou entre com</div>
        <div class="auth-social">
          <button class="btn-social btn-social-google" onclick="handleGoogleLogin()">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button class="btn-social btn-social-discord" onclick="handleDiscordLogin()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            Discord
          </button>
        </div>
        <p class="auth-terms">Ao entrar você aceita nossos <a href="/termos.html">Termos</a></p>
      </div>

      <!-- REGISTER -->
      <div id="auth-panel-register" style="display:none">
        <!-- Passo 1: dados iniciais -->
        <div id="reg-step-1">
          <form onsubmit="handleRegisterStep1(event)">
            <div class="form-group">
              <label class="form-label">Nome Completo</label>
              <input type="text" class="form-input" id="reg-name" placeholder="Ex: João Silva" required minlength="3" autocomplete="name">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="reg-email" placeholder="seu@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
              <label class="form-label">Senha</label>
              <input type="password" class="form-input" id="reg-password" placeholder="Mínimo 6 caracteres" required minlength="6" autocomplete="new-password">
            </div>
            <button type="submit" class="btn-auth-submit" id="btn-reg-step1">
              📧 Enviar código de verificação
            </button>
          </form>
        </div>
        <!-- Passo 2: código de verificação -->
        <div id="reg-step-2" style="display:none">
          <div style="text-align:center;margin-bottom:18px">
            <div style="font-size:32px;margin-bottom:8px">📬</div>
            <div style="font-size:15px;font-weight:800;color:var(--white);margin-bottom:6px">Código enviado!</div>
            <div id="reg-email-hint" style="font-size:12px;color:var(--text2);line-height:1.5">Verifique seu email e insira o código de 6 dígitos abaixo.</div>
          </div>
          <form onsubmit="handleRegisterStep2(event)">
            <div class="form-group">
              <label class="form-label">Código de Verificação</label>
              <input type="text" class="form-input" id="reg-code"
                placeholder="000000" maxlength="6" pattern="[0-9]{6}"
                inputmode="numeric" autocomplete="one-time-code"
                style="font-size:22px;letter-spacing:6px;text-align:center;font-weight:800">
              <span class="form-error" id="reg-code-error" style="display:none;color:var(--red);font-size:12px;margin-top:6px"></span>
            </div>
            <button type="submit" class="btn-auth-submit" id="btn-reg-step2">
              ✅ Verificar e criar conta
            </button>
          </form>
          <button onclick="resetRegForm()" style="display:block;margin:12px auto 0;background:none;border:none;color:var(--text2);font-size:12px;cursor:pointer;font-family:var(--font)">← Voltar e corrigir dados</button>
          <div id="reg-resend-area" style="margin-top:10px;text-align:center">
            <button onclick="resendRegCode()" id="btn-resend-code" style="background:none;border:none;color:var(--cyan2);font-size:12px;cursor:pointer;font-family:var(--font);font-weight:600">🔁 Reenviar código</button>
          </div>
        </div>
        <div class="auth-divider">ou cadastre com</div>
        <div class="auth-social">
          <button class="btn-social btn-social-google" onclick="handleGoogleLogin()">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button class="btn-social btn-social-discord" onclick="handleDiscordLogin()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            Discord
          </button>
        </div>
        <p class="auth-terms">Ao criar uma conta você aceita nossos <a href="/termos.html">Termos</a></p>
      </div>

      <!-- FORGOT -->
      <div id="auth-panel-forgot" style="display:none">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:36px;margin-bottom:8px">🔑</div>
          <h3 style="font-size:16px;font-weight:800;color:var(--white)">Recuperar Senha</h3>
          <p style="font-size:13px;color:var(--text2);margin-top:6px">Informe seu email para receber o código</p>
        </div>
        <form onsubmit="handleForgotPassword(event)">
          <div class="form-group">
            <label class="form-label">Email cadastrado</label>
            <input type="email" class="form-input" id="forgot-email" placeholder="seu@email.com" required>
          </div>
          <div class="form-group" id="forgot-code-group" style="display:none">
            <label class="form-label">Código de Verificação</label>
            <input type="text" class="form-input" id="forgot-code" placeholder="Código do email" maxlength="6">
          </div>
          <div class="form-group" id="forgot-newpass-group" style="display:none">
            <label class="form-label">Nova Senha</label>
            <input type="password" class="form-input" id="forgot-newpass" placeholder="Mínimo 6 caracteres" minlength="6">
          </div>
          <button type="submit" class="btn-auth-submit" id="btn-forgot-submit">Enviar código</button>
        </form>
        <button onclick="switchAuthTab('login')" style="display:block;margin:12px auto 0;background:none;border:none;color:var(--cyan2);font-size:13px;cursor:pointer;font-weight:600;font-family:var(--font)">← Voltar ao login</button>
      </div>

    </div>
  </div>`;
}

// ============================================================
//  AUTH HANDLERS
// ============================================================
let _regStep = 1;
let _forgotStep = 1;
let _pendingRegData = null;
let _pendingCode = null;

function switchAuthTab(tab) {
  ["login","register","forgot"].forEach(t => {
    const panel = document.getElementById(`auth-panel-${t}`);
    if (panel) panel.style.display = t === tab ? "" : "none";
    const btn = document.getElementById(`auth-tab-${t}`);
    if (btn) btn.classList.toggle("active", t === tab);
  });
  _regStep = 1;
  _forgotStep = 1;
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById("btn-login-submit");
  btn.disabled = true;
  btn.textContent = "Verificando...";
  try {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const hash = await Auth.hashPassword(password);
    const user = await API.findUserByEmail(email);
    if (!user || user.password_hash !== hash) { showToast("Email ou senha incorretos", "error"); return; }
    if (!user.email_verified) { showToast("Confirme seu email antes de entrar", "warning"); return; }
    const sessionUser = { id: user.id, full_name: user.full_name, email: user.email, avatar_url: user.avatar_url || "", is_admin: user.is_admin || false, provider: user.provider || "local" };
    Auth.setUser(sessionUser);
    // Log de acesso
    _saveAccessLog(sessionUser, "login").catch(() => {});
    showToast(`Bem-vindo, ${user.full_name.split(" ")[0]}! 👋`, "success");
    closeAuthModal();
    const redirect = sessionStorage.getItem("lagteck_redirect");
    if (redirect) { sessionStorage.removeItem("lagteck_redirect"); window.location.href = redirect; }
    else { setTimeout(() => location.reload(), 500); }
  } catch(err) {
    showToast("Erro ao fazer login. Tente novamente.", "error");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Acessar minha conta";
  }
}

// handleRegister antigo mantido por compatibilidade com fallbacks inline
async function handleRegister(e) { if(e) e.preventDefault(); await handleRegisterStep1(e); }

// ── PASSO 1: valida dados e envia código ──────────────────────
async function handleRegisterStep1(e) {
  if(e) e.preventDefault();
  const btn = document.getElementById("btn-reg-step1");
  if (btn) { btn.disabled = true; btn.textContent = "⏳ Enviando código..."; }

  const name     = document.getElementById("reg-name")?.value.trim() || "";
  const email    = document.getElementById("reg-email")?.value.trim() || "";
  const password = document.getElementById("reg-password")?.value || "";

  if (name.split(" ").filter(Boolean).length < 2) {
    showToast("Informe seu nome completo (nome e sobrenome)", "error");
    if (btn) { btn.disabled = false; btn.textContent = "📧 Enviar código de verificação"; }
    return;
  }
  if (!email || !email.includes("@")) {
    showToast("Informe um email válido", "error");
    if (btn) { btn.disabled = false; btn.textContent = "📧 Enviar código de verificação"; }
    return;
  }
  if (password.length < 6) {
    showToast("Senha deve ter no mínimo 6 caracteres", "error");
    if (btn) { btn.disabled = false; btn.textContent = "📧 Enviar código de verificação"; }
    return;
  }

  try {
    const existing = await API.findUserByEmail(email);
    if (existing) { showToast("Este email já está cadastrado. Faça login.", "error"); return; }

    const code = Auth.generateCode();
    _pendingCode    = code;
    _pendingRegData = { name, email, password };

    // Tenta enviar email
    let emailSent = false;
    try {
      await sendVerificationEmail(email, name, code, "verify");
      emailSent = true;
    } catch(emailErr) {
      console.warn("[register] Falha no EmailJS:", emailErr);
    }

    // Mostra passo 2
    document.getElementById("reg-step-1").style.display = "none";
    document.getElementById("reg-step-2").style.display = "";
    const hint = document.getElementById("reg-email-hint");
    if (hint) hint.textContent = `Enviamos o código para: ${email}`;
    const codeInput = document.getElementById("reg-code");
    if (codeInput) { codeInput.value = ""; codeInput.focus(); }

    if (emailSent) {
      showToast("📧 Código enviado! Verifique seu email.", "success", 8000);
    } else {
      showToast(`🔑 Código: ${code}  (copie agora!)`, "info", 60000);
      const hint2 = document.getElementById("reg-email-hint");
      if (hint2) hint2.innerHTML = `⚠️ Não foi possível enviar o email.<br>Use o código exibido no aviso abaixo.`;
    }
  } catch(err) {
    showToast("Erro ao processar cadastro. Tente novamente.", "error");
    console.error(err);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "📧 Enviar código de verificação"; }
  }
}

// ── PASSO 2: valida código e cria conta ───────────────────────
async function handleRegisterStep2(e) {
  if(e) e.preventDefault();
  const btn = document.getElementById("btn-reg-step2");
  const errEl = document.getElementById("reg-code-error");
  const inputCode = document.getElementById("reg-code")?.value.trim() || "";

  if (!inputCode || inputCode.length !== 6) {
    if (errEl) { errEl.textContent = "Digite o código de 6 dígitos."; errEl.style.display = "block"; }
    return;
  }
  if (String(inputCode) !== String(_pendingCode)) {
    if (errEl) { errEl.textContent = "❌ Código inválido. Verifique e tente novamente."; errEl.style.display = "block"; }
    showToast("Código incorreto", "error");
    document.getElementById("reg-code")?.select();
    return;
  }
  if (errEl) { errEl.textContent = ""; errEl.style.display = "none"; }

  if (btn) { btn.disabled = true; btn.textContent = "⏳ Criando conta..."; }
  try {
    const hash = await Auth.hashPassword(_pendingRegData.password);
    const newUser = await API.post("users", {
      full_name:      _pendingRegData.name,
      email:          _pendingRegData.email,
      password_hash:  hash,
      email_verified: true,
      provider:       "local",
      is_admin:       false,
      favorites:      [],
      cart:           [],
    });
    const sessionUser = {
      id:         newUser.id,
      full_name:  newUser.full_name,
      email:      newUser.email,
      avatar_url: "",
      is_admin:   false,
      provider:   "local",
    };
    Auth.setUser(sessionUser);
    _saveAccessLog(sessionUser, "register").catch(() => {});
    showToast(`🎉 Conta criada! Bem-vindo, ${newUser.full_name.split(" ")[0]}!`, "success", 5000);
    closeAuthModal();
    setTimeout(() => location.reload(), 700);
  } catch(err) {
    showToast("Erro ao criar conta. Tente novamente.", "error");
    console.error(err);
    if (btn) { btn.disabled = false; btn.textContent = "✅ Verificar e criar conta"; }
  }
}

// ── Volta ao passo 1 ─────────────────────────────────────────
function resetRegForm() {
  _regStep = 1; _pendingCode = null; _pendingRegData = null;
  document.getElementById("reg-step-1").style.display = "";
  document.getElementById("reg-step-2").style.display = "none";
  const errEl = document.getElementById("reg-code-error");
  if (errEl) { errEl.textContent = ""; errEl.style.display = "none"; }
}

// ── Reenvia código ────────────────────────────────────────────
async function resendRegCode() {
  if (!_pendingRegData) return;
  const btn = document.getElementById("btn-resend-code");
  if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }
  const newCode = Auth.generateCode();
  _pendingCode = newCode;
  try {
    await sendVerificationEmail(_pendingRegData.email, _pendingRegData.name, newCode, "verify");
    showToast("📧 Novo código enviado!", "success", 6000);
    const hint = document.getElementById("reg-email-hint");
    if (hint) hint.textContent = `Novo código enviado para: ${_pendingRegData.email}`;
  } catch(err) {
    showToast(`🔑 Código: ${newCode}  (copie agora!)`, "info", 60000);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "🔁 Reenviar código"; }
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();
  const btn = document.getElementById("btn-forgot-submit");
  if (_forgotStep === 1) {
    const email = document.getElementById("forgot-email").value.trim();
    btn.disabled = true; btn.textContent = "Enviando...";
    try {
      const user = await API.findUserByEmail(email);
      if (!user) { showToast("Email não encontrado", "error"); return; }
      const code = Auth.generateCode();
      _pendingCode = code;
      _pendingRegData = { email, userId: user.id };
      await sendVerificationEmail(email, user.full_name, code, "reset");
      document.getElementById("forgot-code-group").style.display = "";
      _forgotStep = 2; btn.textContent = "Verificar código";
      showToast("Código enviado! Verifique seu email.", "success", 5000);
    } catch { showToast("Erro ao enviar código", "error"); }
    finally { btn.disabled = false; }
  } else if (_forgotStep === 2) {
    const inputCode = document.getElementById("forgot-code").value.trim();
    if (inputCode !== _pendingCode) { showToast("Código inválido", "error"); return; }
    document.getElementById("forgot-newpass-group").style.display = "";
    _forgotStep = 3; btn.textContent = "Redefinir senha";
  } else {
    const newPass = document.getElementById("forgot-newpass").value;
    if (newPass.length < 6) { showToast("Senha deve ter pelo menos 6 caracteres", "error"); return; }
    btn.disabled = true; btn.textContent = "Salvando...";
    try {
      const hash = await Auth.hashPassword(newPass);
      await API.patch("users", _pendingRegData.userId, { password_hash: hash });
      showToast("Senha redefinida! Faça login.", "success");
      switchAuthTab("login");
    } catch { showToast("Erro ao redefinir senha", "error"); }
    finally { btn.disabled = false; }
  }
}

async function sendVerificationEmail(email, name, code, type = "verify") {
  const cfg = typeof LAGTECK_CONFIG !== "undefined" ? LAGTECK_CONFIG : {};
  const serviceId  = cfg.EMAILJS_SERVICE_ID  || "";
  const templateId = cfg.EMAILJS_TEMPLATE_ID || "";
  const publicKey  = cfg.EMAILJS_PUBLIC_KEY  || "";

  if (typeof emailjs === "undefined") {
    console.warn("⚠️ EmailJS não carregado. Código (DEV):", code);
    showToast(`📋 Código de verificação: ${code}`, "info", 30000);
    return;
  }
  if (!serviceId || serviceId.includes("SEU_") || !templateId || !publicKey || publicKey.includes("SUA_")) {
    console.warn("⚠️ EmailJS não configurado. Código (DEV):", code);
    showToast(`📋 Código de verificação: ${code}`, "info", 30000);
    return;
  }
  try {
    // Inicializa EmailJS com a public key
    emailjs.init(publicKey);
    const templateParams = {
      to_email: email,
      to_name:  name,
      code:     code,
      type:     type,
      subject:  type === "reset" ? "Redefinir senha — Deal Blox" : "Confirme seu email — Deal Blox",
      message:  type === "reset"
        ? `Seu código para redefinir a senha é: ${code}`
        : `Seu código de verificação é: ${code}. Válido por 15 minutos.`,
    };
    const result = await emailjs.send(serviceId, templateId, templateParams);
    console.log("[emailjs] ✅ Enviado:", result.status, result.text);
  } catch(err) {
    console.error("[emailjs] ❌ Erro ao enviar:", err);
    // Exibe o código para não bloquear o usuário mesmo se o email falhar
    showToast(`📋 Código de verificação: ${code}`, "info", 60000);
    throw err; // Propaga para o caller decidir como tratar
  }
}

// ── Salva log de acesso (usado no login/registro/oauth) ──────
async function _saveAccessLog(userData, action) {
  try {
    const ua = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);
    const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
    const browser = /Chrome/i.test(ua) ? "Chrome" : /Firefox/i.test(ua) ? "Firefox" :
                    /Safari/i.test(ua) ? "Safari" : /Edge/i.test(ua) ? "Edge" :
                    /OPR|Opera/i.test(ua) ? "Opera" : "Outro";
    const os = /Windows/i.test(ua) ? "Windows" : /Mac/i.test(ua) ? "macOS" :
               /Android/i.test(ua) ? "Android" : /iPhone|iPad/i.test(ua) ? "iOS" :
               /Linux/i.test(ua) ? "Linux" : "Outro";
    let ip = "", city = "", region = "", country = "", isp = "";
    try {
      const geoRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
      if (geoRes.ok) {
        const geo = await geoRes.json();
        ip = geo.ip || ""; city = geo.city || "";
        region = geo.region || ""; country = geo.country_name || ""; isp = geo.org || "";
      }
    } catch { /* silencia */ }
    const dateStr = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    await fetch("tables/access_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id:    userData.id    || "",
        user_email: userData.email || "",
        user_name:  userData.full_name || "",
        provider:   userData.provider || action,
        ip, city, region, country, isp,
        user_agent:  ua,
        device_type: deviceType,
        browser, os,
        page:   window.location.pathname,
        action,
        created_at_str: dateStr,
      })
    });
  } catch(e) { console.warn("[access_log] Erro:", e); }
}

function handleGoogleLogin() {
  // Delega para loginGoogle() definida em utils.js (usa response_type=code + backend)
  if (typeof loginGoogle === "function") { loginGoogle(); return; }

  // Fallback caso utils.js não tenha carregado
  if (!LAGTECK_CONFIG.GOOGLE_CLIENT_ID || LAGTECK_CONFIG.GOOGLE_CLIENT_ID.includes("SEU_")) {
    showToast("Login com Google não configurado.", "info", 5000); return;
  }
  sessionStorage.setItem("oauth_state", "google");
  sessionStorage.setItem("lagteck_redirect", window.location.href);
  const redirectUri = window.location.origin + "/auth-callback.html";
  const p = new URLSearchParams({
    client_id:     LAGTECK_CONFIG.GOOGLE_CLIENT_ID,
    redirect_uri:  redirectUri,
    response_type: "token",
    scope:         "openid email profile",
    state:         "google",
    prompt:        "select_account",
  });
  window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?" + p.toString();
}

function handleDiscordLogin() {
  // Delega para loginDiscord() definida em utils.js (usa response_type=code + backend)
  if (typeof loginDiscord === "function") { loginDiscord(); return; }

  // Fallback caso utils.js não tenha carregado
  if (!LAGTECK_CONFIG.DISCORD_CLIENT_ID || LAGTECK_CONFIG.DISCORD_CLIENT_ID.includes("SEU_")) {
    showToast("Login com Discord não configurado.", "info", 5000); return;
  }
  sessionStorage.setItem("oauth_state", "discord");
  sessionStorage.setItem("lagteck_redirect", window.location.href);
  const redirectUri = window.location.origin + "/auth-callback.html";
  const p = new URLSearchParams({
    client_id:     LAGTECK_CONFIG.DISCORD_CLIENT_ID,
    redirect_uri:  redirectUri,
    response_type: "code",
    scope:         "identify email",
    state:         "discord",
    prompt:        "consent",
  });
  window.location.href = "https://discord.com/api/oauth2/authorize?" + p.toString();
}

// ============================================================
//  MOBILE NAV & SEARCH
// ============================================================
function closeMobileNav() {
  document.getElementById("mobile-nav")?.classList.remove("open");
  document.getElementById("mobile-nav-overlay")?.classList.remove("open");
}

function initMobileMenu() {
  document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
    document.getElementById("mobile-nav")?.classList.add("open");
    document.getElementById("mobile-nav-overlay")?.classList.add("open");
  });
}

function initHeaderSearch() {
  const input = document.getElementById("header-search-input");
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = input.value.trim();
      if (q) window.location.href = `/contas.html?q=${encodeURIComponent(q)}`;
    }
  });
}

function highlightActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll(".header-nav a, .sidebar-item, .mobile-nav-item").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const isHome = (path === "/" || path === "/index.html") && (href === "/" || href === "/index.html");
    const isMatch = path.endsWith(href) || isHome;
    if (isMatch) link.classList.add("active");
  });
}

window.addEventListener("lagteck:auth", () => {
  const header = document.querySelector(".site-header");
  const sidebar = document.querySelector(".sidebar");
  if (header) header.outerHTML = renderHeader();
  if (sidebar) sidebar.outerHTML = renderSidebar();
});
