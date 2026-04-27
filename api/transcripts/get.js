/**
 * DEAL BLOX — /api/transcripts/get
 * Rota pública: busca um transcript pelo ticket_id.
 * A service_role key fica segura no servidor.
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
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) || isLocal ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Parâmetro id obrigatório' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Servidor não configurado' });
  }

  const sbRes = await fetch(
    `${SUPABASE_URL}/rest/v1/transcripts?ticket_id=eq.${encodeURIComponent(id)}&limit=1`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!sbRes.ok) {
    return res.status(sbRes.status).json({ error: 'Erro ao buscar transcript' });
  }

  const data = await sbRes.json();
  const transcript = Array.isArray(data) ? data[0] : data;

  if (!transcript) {
    return res.status(404).json({ error: 'Transcript não encontrado' });
  }

  // Cache de 5 minutos (transcripts são imutáveis)
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  return res.status(200).json(transcript);
}
