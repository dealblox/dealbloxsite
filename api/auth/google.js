/**
 * LAG TECK — Vercel Function: /api/auth/google
 *
 * Troca o "code" OAuth do Google por dados do usuário.
 * Nunca expõe GOOGLE_CLIENT_SECRET ao frontend.
 *
 * Variáveis de ambiente necessárias no Vercel:
 *   GOOGLE_CLIENT_ID      → Client ID do Google OAuth
 *   GOOGLE_CLIENT_SECRET  → Client Secret do Google OAuth
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

  const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("[google] Variáveis de ambiente não configuradas");
    return res.status(500).json({ error: "Servidor não configurado (env vars ausentes)" });
  }

  try {
    const REDIRECT_URI = "https://lagteck.xyz/auth-callback.html";

const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
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
      console.error("[google] Erro na troca de token:", tokenData);
      return res.status(400).json({
        error: tokenData.error_description || tokenData.error,
      });
    }

    const access_token = tokenData.access_token;
    if (!access_token) {
      return res.status(400).json({ error: "access_token não retornado pelo Google" });
    }

    // ── 2. Busca dados do usuário ────────────────────────────────
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userRes.json();

    if (!userData.email) {
      return res.status(400).json({ error: "Email não retornado pelo Google" });
    }

    // ── 3. Retorna dados padronizados ────────────────────────────
    return res.status(200).json({
      id:       userData.sub,
      name:     userData.name     || userData.email.split("@")[0],
      email:    userData.email,
      avatar:   userData.picture  || "",
      provider: "google",
      verified: userData.email_verified || false,
    });

  } catch (err) {
    console.error("[google] Erro interno:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
