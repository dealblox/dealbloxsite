# Deal Blox — Loja Digital de Blox Fruits

> Loja digital de contas, frutas, upamento, gamepass, scripts e suporte para Blox Fruits.  
> **Domínio:** [dealblox.com.br](https://dealblox.com.br)

---

## 🎨 Design

- **Tema:** Dark mode absoluto (`#0a0a0a`) com neon vermelho (`#ff1a1a`) e ciano (`#00cfff`)
- **Fonte:** Space Grotesk (Google Fonts)
- **Logo:** `/images/logo-dealblox.png` — raposa cibernética (mascote permanente)
- **Hero:** Canvas 3D com cubos isométricos animados (vermelho + ciano piscando)

---

## 📂 Estrutura de Arquivos

```
index.html          → Página inicial (hero 3D, produtos em destaque, avaliações)
contas.html         → Catálogo de contas Blox Fruits
frutas.html         → Catálogo de frutas
gamepass.html       → Gamepass (em breve)
executor.html       → Executor
scripts.html        → Scripts
produto.html        → Página de produto individual + checkout
carrinho.html       → Carrinho com botão "Comprar Tudo"
perfil.html         → Perfil do usuário (dados, pedidos, mensagens)
favoritos.html      → Produtos favoritos
mensagens.html      → Notificações e mensagens
jornalzinho.html    → Blog de notícias do servidor (3 artigos)
admin.html          → Painel administrativo (senha protegida)
auth-callback.html  → Callback OAuth (Google/Discord)
faq.html            → FAQ
termos.html         → Termos de uso
privacidade.html    → Política de privacidade

css/style.css       → Design system Deal Blox (tokens, componentes)
js/config.js        → Configurações centrais (keys, URLs, emails)
js/utils.js         → Auth, Cart, API, helpers
js/layout.js        → renderTopbar, renderHeader, renderSidebar, renderFooter, renderAuthModal
images/
  logo-dealblox.png → Logo principal
  bg-dealblox.png   → Background da logo
  bg-cubos.png      → Cubos 3D (referência visual do hero)
```

---

## ✅ Funcionalidades Implementadas

### Loja
- [x] Catálogo de produtos (contas, frutas, gamepass, executor, scripts)
- [x] Página de produto com checkout (PIX, Cartão)
- [x] Validação do Discord ID no checkout (15-17 dígitos numéricos ou @usuario)
- [x] Carrinho de compras com botão **"Comprar Tudo"** (modal com resumo + Discord)
- [x] Favoritos com sincronização no banco de dados

### Auth
- [x] Cadastro com verificação por email (EmailJS)
- [x] Login com email/senha
- [x] OAuth Google (requer GOOGLE_CLIENT_ID configurado no Google Console para dealblox.com.br)
- [x] OAuth Discord (requer DISCORD_CLIENT_ID configurado)
- [x] Perfil: editar nome, CPF, telefone
- [x] Histórico de pedidos no perfil

### Jornalzinho (Blog)
- [x] **Artigo #1:** Nuke do servidor Discord (timeline completa: bot 3rd party → avisos → ataque → recuperação)
- [x] **Artigo #2:** A jornada do nome — Lag Teck → FoxBlox Store → Deal Blox (timeline 3 fases)
- [x] **Artigo #3:** Nome definitivo "Deal Blox" — status panel, alerts, por que esse nome

### Site
- [x] Cores neon vermelhas em TODAS as páginas (index.html incluído)
- [x] Hero 3D animado com cubos isométricos (canvas 2D com perspectiva isométrica)
- [x] Logo `logo-dealblox.png` em todos os HTML, layout.js, favicon
- [x] Domínio `dealblox.com.br` em todos os configs
- [x] Email `dealblox.suporte@gmail.com` em todos os arquivos
- [x] Responsive mobile (mobile nav, breakpoints)

---

## ⚙️ Configurações Importantes

### js/config.js
```js
GOOGLE_CLIENT_ID:    "188362380531-...apps.googleusercontent.com"  // ← Atualizar no Google Console para dealblox.com.br
DISCORD_CLIENT_ID:   "1464057901739151454"                          // ← Atualizar redirect URI no Discord Dev Portal
MP_PUBLIC_KEY:       "APP_USR-6658413354375969-..."
ADMIN_PASSWORD:      "lagteck@admin2026"
SITE_URL:            "https://dealblox.com.br"
SUPPORT_EMAIL:       "dealblox.suporte@gmail.com"
```

### ⚠️ Para Google OAuth funcionar em produção
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá em Credenciais → ID cliente OAuth 2.0
3. Adicione `https://dealblox.com.br` em **Origens JS autorizadas**
4. Adicione `https://dealblox.com.br/auth-callback.html` em **URIs de redirecionamento**

### ⚠️ Para Discord OAuth funcionar em produção
1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Na aplicação → OAuth2 → Redirects
3. Adicione `https://dealblox.com.br/auth-callback.html`

---

## 🗄️ Tabelas de Dados

| Tabela        | Campos principais                                              |
|---------------|---------------------------------------------------------------|
| `users`       | id, full_name, email, password_hash, cpf, phone, discord_id, favorites |
| `products`    | id, name, category, price, stock, image_url, rarity           |
| `orders`      | id, buyer_name, discord_id, items, total_price, status, order_type |
| `messages`    | id, user_id, type, title, body, read                          |
| `access_logs` | id, user_id, ip, browser, device_type, action                 |

---

## 🛠️ Pendências / Próximos Passos

- [ ] Configurar Google OAuth Client ID para domínio `dealblox.com.br` no Google Console
- [ ] Configurar Discord OAuth redirect URI para `dealblox.com.br` 
- [ ] Backend para QR Code PIX (requer Vercel Function ou servidor)
- [ ] Pagamento com cartão — integração completa Mercado Pago (requer backend)
- [ ] Painel admin: mais funcionalidades de gestão de pedidos
- [ ] Sistema de upamento (gamepass em breve)

---

## 🎯 Histórico de Nomes

1. **Lag Teck** — nome original, escolhido de última hora, tradução: "loja de atrasos"
2. **FoxBlox Store** — transição: raposa + Blox Fruits
3. **Deal Blox** — nome definitivo: "negócio + Blox Fruits"

🦊 O mascote **Raposa** e os donos/equipe permanecem os mesmos.

---

*© 2026 Deal Blox. Não afiliado à Roblox Corporation.*
