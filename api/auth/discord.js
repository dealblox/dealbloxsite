/**
 * LAG TECK — Vercel Function: /api/auth/discord
 *
 * Troca o "code" OAuth do Discord por dados do usuário.
 * Nunca expõe DISCORD_CLIENT_SECRET ao frontend.
 *
 * Variáveis de ambiente necessárias no Vercel:
 *   DISCORD_CLIENT_ID      → Client ID da aplicação Discord
 *   DISCORD_CLIENT_SECRET  → Client Secret da aplicação Discord
 */

export default async function handler(req, res) {
  // ── CORS: aceita os dois domínios do projeto ──────────────────
  const allowedOrigins = [
    "https://lagteck.xyz",
    "https://www.lagteck.xyz",
    "https://lagteck.vercel.app",
    // Desenvolvimento local
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8080",
  ];

  const origin = req.headers.origin || "";
  // Em produção só aceita origens conhecidas; em desenvolvimento aceita qualquer localhost
  const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const corsOrigin = allowedOrigins.includes(origin) || isLocalhost
    ? origin
    : allowedOrigins[0];

  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  // ── Preflight ────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Lê o body ────────────────────────────────────────────────
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { code, redirect_uri } = body || {};

  if (!code) {
    return res.status(400).json({ error: "Parâmetro 'code' ausente" });
  }

  const CLIENT_ID     = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("[discord] Variáveis de ambiente não configuradas");
    return res.status(500).json({ error: "Servidor não configurado (env vars ausentes)" });
  }

  try {
const REDIRECT_URI = redirect_uri || "https://lagteck.xyz/auth-callback.html";

const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }).toString(),
});

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error("[discord] Erro na troca de token:", tokenData);
      return res.status(400).json({
        error: tokenData.error_description || tokenData.error,
      });
    }

    const access_token = tokenData.access_token;
    if (!access_token) {
      return res.status(400).json({ error: "access_token não retornado pelo Discord" });
    }

    // ── 2. Busca dados do usuário (/users/@me) ───────────────────
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userRes.json();

    if (!userData.id) {
      return res.status(400).json({ error: "Dados de usuário inválidos retornados pelo Discord" });
    }

    // ── 3. Monta URL do avatar Discord ───────────────────────────
    //   Formato: https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}.png
    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${(parseInt(userData.discriminator || "0") % 5)}.png`;

    // ── 4. Discord pode não fornecer email se scope não incluir ──
    const email = userData.email || `discord_${userData.id}@noemail.lagteck`;

    // ── 5. Retorna dados padronizados ────────────────────────────
    return res.status(200).json({
      id:            userData.id,
      name:          userData.global_name || userData.username,
      email,
      avatar:        avatarUrl,
      provider:      "discord",
      discord_tag:   userData.discriminator && userData.discriminator !== "0"
                       ? `${userData.username}#${userData.discriminator}`
                       : userData.username,
      verified:      userData.verified || false,
    });

  } catch (err) {
    console.error("[discord] Erro interno:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
