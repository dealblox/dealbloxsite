import crypto from 'node:crypto';

const ALLOWED_ORIGINS = [
  'https://dealblox.com.br',
  'https://www.dealblox.com.br',
  'https://dealbloxsite.vercel.app',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8080',
];

const ALLOWED_TABLES = ['products', 'users', 'access_logs', 'orders', 'messages', 'account_stock'];

function applyCors(req, res) {
  const origin = req.headers.origin || '';
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) || isLocal ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');
  res.setHeader('Vary', 'Origin');
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function createSignature(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function verifyAdminToken(token, secret) {
  if (!token || !secret) return false;

  const [payload, signature] = String(token).split('.');
  if (!payload || !signature) return false;
  if (!/^\d+$/.test(payload)) return false;

  const expected = createSignature(payload, secret);
  if (expected.length !== signature.length) return false;

  const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return false;

  return Number(payload) > Math.floor(Date.now() / 1000);
}

function readToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim();
  return req.headers['x-admin-token'] || '';
}

function formatFilterValue(value) {
  const stringValue = String(value);
  if (/^(eq|neq|gt|gte|lt|lte|like|ilike|is|in|cs|cd|ov|fts|plfts|phfts|wfts|not)\./.test(stringValue)) {
    return stringValue;
  }
  return `eq.${encodeURIComponent(stringValue)}`;
}

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const secret = getSecret();
  if (!verifyAdminToken(readToken(req), secret)) {
    return res.status(401).json({ error: 'Sessão admin inválida ou expirada.' });
  }

  let rawTable = req.query.table || '';
  let urlId = null;

  if (rawTable.includes('/')) {
    const parts = rawTable.split('/');
    rawTable = parts[0];
    urlId = parts[1] || null;
  }

  const table = rawTable;
  if (!table || !ALLOWED_TABLES.includes(table)) {
    return res.status(400).json({ error: `Tabela '${table}' não permitida` });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Servidor não configurado (env vars ausentes)' });
  }

  const baseUrl = `${SUPABASE_URL}/rest/v1/${table}`;
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  try {
    if (req.method === 'GET') {
      const { id: queryId, search, limit = 200, sort, ...filters } = req.query;
      const id = queryId || urlId;

      if (id) {
        const singleRes = await fetch(`${baseUrl}?id=eq.${id}&limit=1`, { headers });
        const singleData = await singleRes.json();
        if (!singleRes.ok) return res.status(singleRes.status).json(singleData);
        return res.status(200).json(Array.isArray(singleData) ? singleData[0] : singleData);
      }

      let url = `${baseUrl}?limit=${limit}`;

      if (search && table === 'users') {
        url += `&email=ilike.*${encodeURIComponent(search)}*`;
      }

      if (sort) {
        url += `&order=${sort}`;
      }

      for (const [key, val] of Object.entries(filters)) {
        if (key === 'table') continue;
        url += `&${key}=${formatFilterValue(val)}`;
      }

      const listRes = await fetch(url, { headers });
      const listData = await listRes.json();
      if (!listRes.ok) return res.status(listRes.status).json(listData);

      const rows = Array.isArray(listData) ? listData : [listData];
      return res.status(200).json({ data: rows, total: rows.length });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }

      const createRes = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const createData = await createRes.json();
      if (!createRes.ok) return res.status(createRes.status).json(createData);
      return res.status(201).json(Array.isArray(createData) ? createData[0] : createData);
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const id = req.query.id || urlId;
      if (!id) return res.status(400).json({ error: `ID obrigatório para ${req.method}` });

      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }

      const updateRes = await fetch(`${baseUrl}?id=eq.${id}`, {
        method: req.method,
        headers,
        body: JSON.stringify(body),
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) return res.status(updateRes.status).json(updateData);
      return res.status(200).json(Array.isArray(updateData) ? updateData[0] : updateData);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || urlId;
      if (!id) return res.status(400).json({ error: 'ID obrigatório para DELETE' });

      const deleteRes = await fetch(`${baseUrl}?id=eq.${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!deleteRes.ok) {
        const deleteData = await deleteRes.json();
        return res.status(deleteRes.status).json(deleteData);
      }
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    console.error(`[admin/tables/${table}] Erro interno:`, err);
    return res.status(500).json({ error: `Erro Supabase: ${err?.message || String(err)}` });
  }
}
