/**
 * DEAL BLOX — /api/payments/webhook
 */

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  if (req.method === "GET") return res.status(200).send("OK");
  if (req.method !== "POST") return res.status(405).end();

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const SUPABASE_URL    = process.env.SUPABASE_URL;
  const SUPABASE_KEY    = process.env.SUPABASE_KEY;

  if (!MP_ACCESS_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("[webhook] Env vars ausentes");
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
    if (!body || typeof body !== "object") body = {};

    console.log("[webhook] recebido:", JSON.stringify(body));

    const action = body.action || "";
    const type   = body.type || body.topic || "";
    const isPaymentEvent = type === "payment" || action === "payment.updated" || action === "payment.created";

    let paymentId = body?.data?.id ? String(body.data.id) : null;
    if (!paymentId && body.resource) {
      const match = String(body.resource).match(/\/payments\/(\d+)/);
      if (match) paymentId = match[1];
    }

    if (!isPaymentEvent || !paymentId) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    // 1. Busca pagamento no MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    });
    if (!mpRes.ok) {
      console.error("[webhook] MP erro:", await mpRes.text());
      return res.status(200).end();
    }
    const payment = await mpRes.json();
    console.log("[webhook] status MP:", payment.status);

    if (payment.status !== "approved") {
      return res.status(200).json({ ok: true, status: payment.status });
    }

    const sbHeaders = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    // 2. Busca pedido no Supabase
    const orderRes = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?payment_id=eq.${paymentId}&limit=1`,
      { headers: sbHeaders }
    );
    if (!orderRes.ok) {
      console.error("[webhook] Erro ao buscar pedido:", await orderRes.text());
      return res.status(200).end();
    }
    const orders = await orderRes.json();
    if (!Array.isArray(orders) || orders.length === 0) {
      console.warn("[webhook] pedido não encontrado para payment_id:", paymentId);
      return res.status(200).json({ ok: true, warn: "order not found" });
    }

    const order = orders[0];
    if (order.status === "paid") {
      return res.status(200).json({ ok: true, already: "paid" });
    }

    // 3. Verifica se é produto de contas e pega uma do estoque
    let accountDelivery = null;
    let isContaProduct = false;

    if (order.product_id) {
      const prodRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${order.product_id}&limit=1`,
        { headers: sbHeaders }
      );
      if (prodRes.ok) {
        const prods = await prodRes.json();
        if (prods?.[0]?.category === "contas") {
          isContaProduct = true;

          // Pega uma conta disponível do estoque do site
          const stockRes = await fetch(
            `${SUPABASE_URL}/rest/v1/account_stock?product_id=eq.${order.product_id}&source=eq.site&status=eq.available&limit=1`,
            { headers: sbHeaders }
          );
          if (stockRes.ok) {
            const stock = await stockRes.json();
            if (Array.isArray(stock) && stock.length > 0) {
              accountDelivery = stock[0];

              // Marca conta como vendida
              await fetch(`${SUPABASE_URL}/rest/v1/account_stock?id=eq.${accountDelivery.id}`, {
                method: "PATCH",
                headers: sbHeaders,
                body: JSON.stringify({
                  status: "sold",
                  sold_to_user_id: order.user_id,
                  sold_to_email: order.user_email,
                  order_id: order.id,
                  sold_at: new Date().toISOString(),
                }),
              });

              // Atualiza estoque do produto (conta disponíveis restantes)
              const remainRes = await fetch(
                `${SUPABASE_URL}/rest/v1/account_stock?product_id=eq.${order.product_id}&source=eq.site&status=eq.available`,
                { headers: { ...sbHeaders, "Prefer": "count=exact" } }
              );
              const remaining = parseInt(remainRes.headers.get("content-range")?.split("/")[1] || "0");
              await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${order.product_id}`, {
                method: "PATCH",
                headers: sbHeaders,
                body: JSON.stringify({ stock: remaining }),
              });

              console.log("[webhook] ✅ Conta entregue:", accountDelivery.username);
            } else {
              console.warn("[webhook] ⚠️ Sem contas disponíveis no estoque!");
            }
          }
        }
      }
    }

    // 4. Atualiza pedido para "paid"
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
      method: "PATCH",
      headers: sbHeaders,
      body: JSON.stringify({ status: "paid", paid_at: new Date().toISOString() }),
    });
    if (!patchRes.ok) {
      console.error("[webhook] Erro ao atualizar pedido:", await patchRes.text());
      return res.status(200).end();
    }

    // 5. Monta mensagem de entrega
    let msgTitle = "Compra confirmada! 🎉";
    let msgBody;

    if (isContaProduct && accountDelivery) {
      // Entrega as credenciais diretamente na notificação
      msgBody = `Seu pedido de **${order.product_name}** foi confirmado! 🎉\n\n🔑 **Credenciais da sua conta:**\n👤 Usuário: \`${accountDelivery.username}\`\n🔒 Senha: \`${accountDelivery.password}\`\n\n⚠️ Troque a senha imediatamente após acessar!`;
    } else if (isContaProduct && !accountDelivery) {
      // Conta paga mas sem estoque — manda pro Discord
      msgBody = `Seu pedido de **${order.product_name}** foi confirmado! 🎉\n\nNosso estoque está sendo reabastecido. Abra um ticket no Discord para receber sua conta rapidamente.`;
    } else {
      // Frutas/gamepass — sempre Discord
      msgBody = `Seu pedido de **${order.product_name}** foi confirmado! 🎉\n\nAbra um ticket no Discord para receber seu produto.`;
    }

    await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: "POST",
      headers: sbHeaders,
      body: JSON.stringify({
        user_id:     order.user_id,
        type:        "purchase",
        title:       msgTitle,
        body:        msgBody,
        read:        false,
        order_id:    order.id,
        delivery_id: order.delivery_id,
      }),
    });

    // Envia email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM     = process.env.EMAIL_FROM || "Deal Blox <noreply@dealblox.com.br>";
    if (RESEND_API_KEY && order.user_email) {
      try {
        const emailType = isContaProduct && accountDelivery ? "contas" : "discord";
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:    EMAIL_FROM,
            to:      [order.user_email],
            subject: emailType === "contas"
              ? `✅ Suas credenciais — ${order.product_name} | Deal Blox`
              : `✅ Compra confirmada — ${order.product_name} | Deal Blox`,
            html: emailType === "contas" ? `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f1320;color:#c8d8f0;padding:32px;border-radius:16px">
  <h2 style="color:#06b6d4;margin-bottom:4px">🎉 Compra confirmada!</h2>
  <p style="color:#888;margin-bottom:24px">Seu pedido de <strong style="color:#fff">${order.product_name}</strong> foi aprovado.</p>
  <div style="background:#0d1a2a;border:1px solid rgba(6,182,212,.4);border-radius:12px;padding:20px;margin-bottom:20px">
    <p style="color:#06b6d4;font-weight:700;font-size:15px;margin:0 0 12px">🔑 Credenciais da sua conta</p>
    <p style="margin:6px 0;font-size:14px">👤 Usuário: <strong style="color:#fff;font-family:monospace">${accountDelivery.username}</strong></p>
    <p style="margin:6px 0;font-size:14px">🔒 Senha: <strong style="color:#fff;font-family:monospace">${accountDelivery.password}</strong></p>
    <p style="font-size:12px;color:#f59e0b;margin-top:12px;margin-bottom:0">⚠️ Troque a senha imediatamente após acessar!</p>
  </div>
  <p style="font-size:11px;color:#444;margin-top:28px;border-top:1px solid #1e2a3a;padding-top:16px">Deal Blox — Email automático.</p>
</div>` : `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f1320;color:#c8d8f0;padding:32px;border-radius:16px">
  <h2 style="color:#06b6d4;margin-bottom:4px">🎉 Compra confirmada!</h2>
  <p style="color:#888;margin-bottom:24px">Seu pedido de <strong style="color:#fff">${order.product_name}</strong> foi aprovado.</p>
  <div style="background:#0d1a2a;border:1px solid rgba(6,182,212,.2);border-radius:12px;padding:20px;margin-bottom:20px">
    <p style="font-size:14px;margin:0 0 8px">Abra um ticket no Discord com o ID abaixo:</p>
    <p style="font-size:22px;font-weight:800;color:#06b6d4;letter-spacing:2px;margin:8px 0">${order.delivery_id || order.id}</p>
  </div>
  <a href="https://discord.gg/rPFN7BMC5k" style="background:#5865f2;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">💬 Discord Deal Blox</a>
  <p style="font-size:11px;color:#444;margin-top:28px;border-top:1px solid #1e2a3a;padding-top:16px">Deal Blox — Email automático.</p>
</div>`,
          }),
        });
        console.log("[webhook] ✅ Email enviado para:", order.user_email);
      } catch(emailErr) {
        console.warn("[webhook] Email falhou:", emailErr.message);
      }
    }

    console.log("[webhook] ✅ OK:", order.id);
    return res.status(200).json({ ok: true, order_id: order.id });

  } catch (err) {
    console.error("[webhook] erro:", err);
    return res.status(200).end();
  }
}