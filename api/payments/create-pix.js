/**
 * DEAL BLOX — /api/payments/create-pix
 * Cria cobrança PIX via Mercado Pago e retorna QR code.
 *
 * Variáveis de ambiente necessárias no Vercel:
 *   MP_ACCESS_TOKEN → token do Mercado Pago (começa com APP_USR-)
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

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) || isLocal ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: "MP_ACCESS_TOKEN não configurado" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }

  const { amount, description, email, delivery_id } = body;

  if (!amount || !email) {
    return res.status(400).json({ error: "amount e email são obrigatórios" });
  }

  try {
    const payload = {
      transaction_amount: Number(amount),
      description: description || "Produto Deal Blox",
      payment_method_id: "pix",
      payer: {
        email: email,
      },
      external_reference: delivery_id || `dealblox-${Date.now()}`,
    };

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": delivery_id || `dealblox-${Date.now()}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await mpRes.json();

    if (!mpRes.ok) {
      console.error("[create-pix] MP erro:", data);
      return res.status(mpRes.status).json({ error: data.message || "Erro Mercado Pago", details: data });
    }

    const pixInfo = data.point_of_interaction?.transaction_data;
    if (!pixInfo) {
      return res.status(500).json({ error: "PIX não retornado pelo Mercado Pago" });
    }

    return res.status(200).json({
      payment_id:     String(data.id),
      qr_code:        pixInfo.qr_code,
      qr_code_base64: pixInfo.qr_code_base64,
      status:         data.status,
      expires_at:     data.date_of_expiration,
    });

  } catch (err) {
    console.error("[create-pix] Erro interno:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}