/**
 * DEAL BLOX — /api/transcripts/save
 * Chamada pelo bot do Discord para salvar um transcript no Supabase.
 * Autenticação via header: Authorization: Bearer <BOT_SECRET>
 */

const ALLOWED_ORIGINS = [
  'https://dealblox.com.br',
  'https://www.dealblox.com.br',
  'https://dealbloxsite.vercel.app',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) || isLocal ? origin : '*';

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  // Autenticação: o bot precisa enviar o segredo correto
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const BOT_SECRET = process.env.BOT_TRANSCRIPT_SECRET;

  if (!BOT_SECRET || token !== BOT_SECRET) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Servidor não configurado' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'JSON inválido' }); }
  }

  const {
    ticket_id,        // string — ID único gerado pelo bot
    ticket_number,    // number
    guild_name,       // string
    channel_name,     // string
    user_id,          // string (Discord user ID)
    user_tag,         // string (ex: pedro#0001)
    sector,           // string (nome do setor)
    status,           // string (closed)
    claimed_by,       // string | null
    closed_by,        // string | null
    close_reason,     // string | null
    opened_at,        // ISO string
    closed_at,        // ISO string
    messages,         // array de { author_tag, author_id, content, timestamp, embeds[], attachments[] }
  } = body;

  if (!ticket_id || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Campos obrigatórios: ticket_id, messages[]' });
  }

  const payload = {
    ticket_id,
    ticket_number: ticket_number || 0,
    guild_name: guild_name || 'Deal Blox',
    channel_name: channel_name || '',
    user_id: user_id || '',
    user_tag: user_tag || '',
    sector: sector || '',
    status: status || 'closed',
    claimed_by: claimed_by || null,
    closed_by: closed_by || null,
    close_reason: close_reason || null,
    opened_at: opened_at || null,
    closed_at: closed_at || new Date().toISOString(),
    messages,
    created_at: new Date().toISOString(),
  };

  const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/transcripts`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  const sbData = await sbRes.json();
  if (!sbRes.ok) {
    console.error('[transcripts/save] Supabase erro:', sbData);
    return res.status(sbRes.status).json({ error: 'Erro ao salvar no Supabase', detail: sbData });
  }

  const saved = Array.isArray(sbData) ? sbData[0] : sbData;
  return res.status(201).json({
    ok: true,
    ticket_id: saved.ticket_id,
    url: `https://dealblox.com.br/transcript.html?id=${saved.ticket_id}`,
  });
}
