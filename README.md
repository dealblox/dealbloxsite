# 🎮 Lag Teck — Loja de Blox Fruits

Loja digital estática hospedada no Vercel para venda de contas, frutas, gamepass e ferramentas de Blox Fruits.

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação
- **Login local** (email + senha) com hash SHA-256
- **Login Google** via OAuth 2.0 fluxo implícito (`response_type=token`)  
  — Funciona 100% sem backend: access_token vem no hash da URL, dados buscados via `/oauth2/v3/userinfo`
- **Login Discord** via OAuth 2.0 (`response_type=code`)  
  — Requer Vercel Functions (`/api/auth/discord.js`) para troca de código por token
- **Cadastro** em 2 passos: dados → código de verificação por email (EmailJS)
- **Recuperação de senha** via código por email
- **Sessão** armazenada em `localStorage` como `lagteck_user`
- **Log de acessos** gravado na tabela `access_logs` a cada login/cadastro

### 🏪 Loja
- **Página inicial** (`/index.html`) — carrega produtos de "contas" e "frutas" do Supabase com fallback para API interna; "Ver Detalhes" **não** exige login
- **Contas Blox Fruits** (`/contas.html`) — filtro, busca, ordenação
- **Frutas** (`/frutas.html`) — filtro, busca, ordenação  
- **Gamepass** (`/gamepass.html`) — em breve
- **Executor** (`/executor.html`)
- **Scripts** (`/scripts.html`)
- **Jornalzinho do Servidor** (`/jornalzinho.html`)

### 💳 Checkout (produto.html)
- **Bloqueio de compra** sem login com redirecionamento ao modal de autenticação
- **Visualização do produto** disponível sem login
- **Modal de checkout** corrigido: botão X fecha corretamente; ESC também fecha; clique fora fecha
- **Step 1 — Dados do comprador**: Nome (obrigatório), CPF (opcional), Discord ID (obrigatório) + tutorial inline
- **Step 2 — Método de pagamento**: PIX ou Cartão
- **Step 3A — PIX**: QR Code fictício em modo demo + botão "Simular pagamento PIX"; PIX real via Mercado Pago quando configurado
- **Step 3B — Cartão**: Botão "Simular Pagamento (demo)" em modo demo; formulário MP Brick quando chave configurada
- **Step 4 — Discord obrigatório**: Exige entrada no servidor antes de confirmar
- **Step 5 — Sucesso**: ID de entrega de 8 caracteres alfanuméricos, notificação por email (EmailJS), mensagem no perfil
- **Pedido salvo** na tabela `orders` com delivery_id, status, dados do comprador
- **Estoque decrementado** automaticamente após pagamento
- **Notificação criada** na tabela `messages` do usuário

### 🧭 Navegação
- **Sidebar** com seções: Loja | Outros | Minha Conta
- **Header** com busca global, carrinho, perfil
- **Mobile nav** responsivo com todas as seções
- **auth-callback.html** robusto: detecta `state` vazio, suporte a code flow e implicit

### 👤 Perfil e Conta
- **Perfil** (`/perfil.html`) — campos: nome, CPF (opcional), telefone (opcional), email (somente leitura); 3 abas: Perfil / Pedidos / Mensagens
- **Favoritos** (`/favoritos.html`) — sincroniza com banco (se logado) + localStorage
- **Carrinho** (`/carrinho.html`)
- **Mensagens** (`/mensagens.html`) — filtros por tipo; marcar lida/todas; CTA Discord

### 💾 Tabelas no banco (RESTful API)
| Tabela | Campos principais |
|--------|------------------|
| `users` | id, full_name, email, password_hash, cpf, phone, favorites[], is_admin, provider |
| `products` | id, name, category, price, original_price, stock, active, rarity, image_url |
| `orders` | id, user_id, user_email, product_id, product_name, amount, status, payment_method, delivery_id, buyer_name, buyer_cpf, discord_id |
| `messages` | id, user_id, user_email, type, title, body, read, order_id, delivery_id |
| `access_logs` | id, user_id, user_email, provider, timestamp |

---

## 📁 Estrutura de Arquivos

```
/
├── index.html              — Página inicial
├── contas.html             — Listagem de contas
├── frutas.html             — Listagem de frutas
├── produto.html            — Detalhe de produto
├── auth-callback.html      — Callback OAuth Google/Discord
├── perfil.html             — Perfil do usuário
├── jornalzinho.html        — Jornalzinho do servidor (em breve)
├── admin.html              — Painel administrativo
├── js/
│   ├── config.js           — Configurações e credenciais públicas
│   ├── utils.js            — Auth, Cart, API, loginGoogle(), loginDiscord()
│   └── layout.js           — renderHeader, renderSidebar, renderAuthModal, handlers
├── css/
│   └── style.css           — Estilos globais
├── api/
│   ├── auth/google.js      — Vercel Function: troca code→token Google
│   └── auth/discord.js     — Vercel Function: troca code→token Discord
├── vercel.json             — Configuração Vercel (rewrites, headers, funções)
└── .env.example            — Template de variáveis de ambiente
```

---

## 🔑 Variáveis de Ambiente (Vercel)

| Variável | Uso |
|---|---|
| `GOOGLE_CLIENT_ID` | ID do cliente OAuth Google (frontend + backend) |
| `GOOGLE_CLIENT_SECRET` | Secret Google (apenas backend/Vercel Function) |
| `DISCORD_CLIENT_ID` | ID do cliente OAuth Discord |
| `DISCORD_CLIENT_SECRET` | Secret Discord (apenas backend/Vercel Function) |
| `MP_PUBLIC_KEY` | Chave pública Mercado Pago (frontend) |
| `MP_ACCESS_TOKEN` | Token privado Mercado Pago (backend) |
| `EMAILJS_SERVICE_ID` | `service_mzmityx` |
| `EMAILJS_TEMPLATE_ID` | `template_6ztpr7k` |
| `EMAILJS_PUBLIC_KEY` | `7SAN7fAAsYLc7e-6W` |
| `ADMIN_PASSWORD` | Senha do painel admin |

> ⚠️ Nunca commite secrets. Use `.env.local` localmente.

---

## 🔗 URIs de Redirecionamento OAuth (cadastrar nos consoles)

**Google Cloud Console → Credenciais → URIs de redirecionamento autorizados:**
```
https://lagteck.xyz/auth-callback.html
https://lagteck.vercel.app/auth-callback.html
```

**Discord Developer Portal → OAuth2 → Redirects:**
```
https://lagteck.xyz/auth-callback.html
https://lagteck.vercel.app/auth-callback.html
```

---

## 🔄 Fluxo OAuth

### Google (fluxo implícito — funciona sem backend)
1. `loginGoogle()` → redireciona para Google com `response_type=token`
2. Google redireciona para `/auth-callback.html#access_token=...&state=google`
3. `auth-callback.html` lê o token do hash → busca dados em `googleapis.com/oauth2/v3/userinfo`
4. Cria/atualiza usuário no banco → salva sessão → redireciona

### Discord (requer Vercel Functions)
1. `loginDiscord()` → redireciona para Discord com `response_type=code`
2. Discord redireciona para `/auth-callback.html?code=...&state=discord`
3. `auth-callback.html` → POST `/api/auth/discord` com o code
4. Vercel Function troca code por token → busca `/users/@me` → retorna JSON
5. Cria/atualiza usuário → salva sessão → redireciona

---

## 🗄️ Tabelas de Dados (RESTful Table API)

### `users`
| Campo | Tipo | Descrição |
|---|---|---|
| full_name | text | Nome completo |
| email | text | Email único |
| password_hash | text | SHA-256 + salt |
| email_verified | bool | Email confirmado |
| provider | text | local / google / discord |
| avatar_url | text | URL do avatar |
| is_admin | bool | Admin? |

### `products`
| Campo | Tipo | Descrição |
|---|---|---|
| name | text | Nome do produto |
| category | text | accounts / fruits / gamepass |
| price | number | Preço em R$ |
| stock | number | Estoque |
| active | bool | Ativo? |
| rarity | text | Comum / Rara / Épica / Lendária / Mítica |

### `access_logs`
Registra cada login/cadastro com IP, cidade, navegador, OS, dispositivo, provider.

---

## ⚙️ Páginas e Rotas

| Rota | Descrição |
|---|---|
| `/` | Página inicial |
| `/contas.html` | Contas Blox Fruits |
| `/frutas.html` | Frutas |
| `/produto.html?id=ID` | Detalhe do produto |
| `/auth-callback.html` | Callback OAuth |
| `/perfil.html` | Perfil do usuário |
| `/admin.html` | Painel admin |
| `/jornalzinho.html` | Jornalzinho (em breve) |

---

## ⏳ Pendente / Próximos Passos

- [ ] Configurar `GOOGLE_CLIENT_ID` e `DISCORD_CLIENT_ID` reais em `js/config.js`
- [ ] Adicionar variáveis no painel Vercel → Settings → Environment Variables
- [ ] Registrar URIs de redirecionamento no Google Console e Discord Portal
- [ ] Implementar conteúdo do Jornalzinho do Servidor
- [ ] Implementar fluxo de pagamento Mercado Pago
- [ ] Implementar sistema de mensagens
- [ ] Upload de imagem de perfil
- [ ] Sistema de avaliações de produtos
#   D e a l B l o x - S i t e  
 