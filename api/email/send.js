/**
 * DEAL BLOX — /api/email/send
 * Envia emails transacionais via Resend.
 * 
 * Variável de ambiente necessária no Vercel:
 *   RESEND_API_KEY → obter em https://resend.com/api-keys
 *   EMAIL_FROM     → ex: "Deal Blox <noreply@dealblox.com.br>"
 */

const ALLOWED_ORIGINS = [
  "https://dealblox.com.br",
  "https://www.dealblox.com.br",
  "https://dealbloxsite.vercel.app",
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:8080",
];

function applyCors(req, res) {
  const origin = req.headers.origin || "";
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) || isLocal ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

function emailVerify({ to_name, to_email, code }) {
  return {
    to: to_email,
    subject: `${code} — Confirme seu email | Deal Blox`,
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f1320;color:#c8d8f0;padding:32px;border-radius:16px">
  <h2 style="color:#06b6d4;margin-bottom:4px">📧 Confirme seu email</h2>
  <p style="color:#888;margin-bottom:24px">Olá, <strong style="color:#fff">${to_name}</strong>! Use o código abaixo para confirmar seu cadastro.</p>
  <div style="background:#0d1a2a;border:1px solid rgba(6,182,212,.4);border-radius:12px;padding:24px;text-align:center;margin-bottom:20px">
    <p style="font-size:36px;font-weight:800;color:#06b6d4;letter-spacing:8px;margin:0">${code}</p>
    <p style="font-size:12px;color:#888;margin-top:8px;margin-bottom:0">Válido por 15 minutos</p>
  </div>
  <p style="font-size:12px;color:#444;margin-top:24px;border-top:1px solid #1e2a3a;padding-top:16px">Se você não criou uma conta na Deal Blox, ignore este email.</p>
</div>`,
  };
}

function emailReset({ to_name, to_email, code }) {
  return {
    to: to_email,
    subject: `${code} — Redefinir senha | Deal Blox`,
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f1320;color:#c8d8f0;padding:32px;border-radius:16px">
  <h2 style="color:#f59e0b;margin-bottom:4px">🔒 Redefinir senha</h2>
  <p style="color:#888;margin-bottom:24px">Olá, <strong style="color:#fff">${to_name}</strong>! Use o código abaixo para redefinir sua senha.</p>
  <div style="background:#0d1a2a;border:1px solid rgba(245,158,11,.4);border-radius:12px;padding:24px;text-align:center;margin-bottom:20px">
    <p style="font-size:36px;font-weight:800;color:#f59e0b;letter-spacing:8px;margin:0">${code}</p>
    <p style="font-size:12px;color:#888;margin-top:8px;margin-bottom:0">Válido por 15 minutos</p>
  </div>
  <p style="font-size:12px;color:#444;margin-top:24px;border-top:1px solid #1e2a3a;padding-top:16px">Se você não solicitou a redefinição, ignore este email.</p>
</div>`,
  };
}

function emailContas({ to_name, to_email, product_name, order_id, account_username, account_password, discord_link }) {
  return {
    to: to_email,
    subject: `✅ Suas credenciais — ${product_name} | Deal Blox`,
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f1320;color:#c8d8f0;padding:32px;border-radius:16px">
  <h2 style="color:#06b6d4;margin-bottom:4px">🎉 Compra confirmada, ${to_name}!</h2>
  <p style="color:#888;margin-bottom:24px">Seu pedido de <strong style="color:#fff">${product_name}</strong> foi aprovado e sua conta está pronta.</p>

  <div style="background:#0d1a2a;border:1px solid rgba(6,182,212,.4);border-radius:12px;padding:20px;margin-bottom:20px">
    <p style="color:#06b6d4;font-weight:700;font-size:15px;margin:0 0 12px">🔑 Credenciais da sua conta</p>
    <p style="margin:6px 0;font-size:14px">👤 Usuário: <strong style="color:#fff;font-family:monospace">${account_username}</strong></p>
    <p style="margin:6px 0;font-size:14px">🔒 Senha: <strong style="color:#fff;font-family:monospace">${account_password}</strong></p>
    <p style="font-size:12px;color:#f59e0b;margin-top:12px;margin-bottom:0">⚠️ Troque a senha imediatamente após acessar!</p>
  </div>

  <p style="font-size:13px;color:#888">ID do pedido: <strong style="color:#fff">${order_id}</strong></p>
  <p style="font-size:13px;color:#888">Precisa de suporte? Abra um ticket:</p>
  <a href="${discord_link}" style="background:#5865f2;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;margin-top:4px">💬 Discord Deal Blox</a>

  <p style="font-size:11px;color:#444;margin-top:28px;border-top:1px solid #1e2a3a;padding-top:16px">Deal Blox — Este email foi enviado automaticamente, não responda.</p>
</div>`,
  };
}

function emailReviewRequest({ to_name, to_email, product_name, order_id, review_url }) {
  return {
    to: to_email,
    subject: `⭐ Como foi sua experiência? — Deal Blox`,
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f1320;color:#c8d8f0;padding:32px;border-radius:16px">
  <h2 style="color:#f59e0b;margin-bottom:4px">⭐ Como foi sua experiência?</h2>
  <p style="color:#888;margin-bottom:20px">Olá, <strong style="color:#fff">${to_name}</strong>! Seu pedido de <strong style="color:#fff">${product_name}</strong> foi entregue.</p>
  <p style="color:#c8d8f0;margin-bottom:24px">Sua opinião é muito importante para nós. Leva menos de 1 minuto!</p>

  <div style="background:#0d1a2a;border:1px solid rgba(245,158,11,.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
    <p style="font-size:32px;margin:0 0 12px;letter-spacing:4px">⭐⭐⭐⭐⭐</p>
    <a href="${review_url}" style="background:#f59e0b;color:#000;padding:12px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:800;font-size:15px">Avaliar agora</a>
  </div>

  <p style="font-size:12px;color:#888">Pedido: <strong style="color:#fff">${order_id}</strong></p>
  <p style="font-size:11px;color:#444;margin-top:24px;border-top:1px solid #1e2a3a;padding-top:16px">Deal Blox — Este email foi enviado automaticamente, não responda.</p>
</div>`,
  };
}

function emailDiscord({ to_name, to_email, product_name, order_id, discord_link }) {
  return {
    to: to_email,
    subject: `✅ Compra confirmada — ${product_name} | Deal Blox`,
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f1320;color:#c8d8f0;padding:32px;border-radius:16px">
  <h2 style="color:#06b6d4;margin-bottom:4px">🎉 Compra confirmada, ${to_name}!</h2>
  <p style="color:#888;margin-bottom:24px">Seu pedido de <strong style="color:#fff">${product_name}</strong> foi aprovado com sucesso.</p>

  <div style="background:#0d1a2a;border:1px solid rgba(6,182,212,.2);border-radius:12px;padding:20px;margin-bottom:20px">
    <p style="font-size:14px;margin:0 0 8px">Para retirar seu produto, abra um ticket no Discord com o ID abaixo:</p>
    <p style="font-size:22px;font-weight:800;color:#06b6d4;letter-spacing:2px;margin:8px 0">${order_id}</p>
    <p style="font-size:12px;color:#f59e0b;margin:0">⚠️ Guarde este ID — você precisará dele!</p>
  </div>

  <a href="${discord_link}" style="background:#5865f2;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">💬 Abrir ticket no Discord</a>

  <p style="font-size:11px;color:#444;margin-top:28px;border-top:1px solid #1e2a3a;padding-top:16px">Deal Blox — Este email foi enviado automaticamente, não responda.</p>
</div>`,
  };
}

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM     = process.env.EMAIL_FROM || "Deal Blox <noreply@dealblox.com.br>";

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY não configurada" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }

  const { type, ...params } = body || {};

  // Monta email conforme tipo
  let email;
  if (type === "contas") {
    email = emailContas(params);
  } else if (type === "verify") {
    email = emailVerify(params);
  } else if (type === "reset") {
    email = emailReset(params);
  } else if (type === "review_request") {
    email = emailReviewRequest(params);
  } else {
    email = emailDiscord(params);
  }

  if (!email.to) {
    return res.status(400).json({ error: "to_email é obrigatório" });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:    EMAIL_FROM,
        to:      [email.to],
        subject: email.subject,
        html:    email.html,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("[email/send] Resend erro:", data);
      return res.status(r.status).json({ error: data.message || "Erro ao enviar email" });
    }

    console.log("[email/send] ✅ Enviado para:", email.to);
    return res.status(200).json({ ok: true, id: data.id });

  } catch (err) {
    console.error("[email/send] Erro interno:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}