/**
 * DEAL BLOX — /api/payments/status/[id]
 * Verifica o status de um pagamento no Mercado Pago.
 * Chamado pelo frontend a cada 5s para detectar pagamento aprovado.
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
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido" });

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: "MP_ACCESS_TOKEN não configurado" });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID do pagamento obrigatório" });

  try {
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!mpRes.ok) {
      const err = await mpRes.json();
      return res.status(mpRes.status).json({ error: err.message || "Erro Mercado Pago" });
    }

    const data = await mpRes.json();

    return res.status(200).json({
      payment_id:    String(data.id),
      status:        data.status,
      status_detail: data.status_detail,
      amount:        data.transaction_amount,
    });

  } catch (err) {
    console.error("[payment-status] Erro:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}