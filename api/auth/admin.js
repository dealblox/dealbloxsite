import crypto from 'node:crypto';

const TOKEN_TTL_SECONDS = 60 * 60 * 8;
const ALLOWED_ORIGINS = [
  'https://dealblox.com.br',
  'https://www.dealblox.com.br',
  'https://dealbloxsite.vercel.app',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8080',
];

function applyCors(req, res) {
  const origin = req.headers.origin || '';
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) || isLocal ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');
  res.setHeader('Vary', 'Origin');
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function createSignature(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function createAdminToken(secret) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = String(exp);
  const signature = createSignature(payload, secret);
  return `${payload}.${signature}`;
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

  const exp = Number(payload);
  return exp > Math.floor(Date.now() / 1000);
}

function readToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim();
  return req.headers['x-admin-token'] || '';
}

export default function handler(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const correct = process.env.ADMIN_PASSWORD;
  if (!correct) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD não configurada no Vercel.' });
  }

  const secret = getSecret();

  if (req.method === 'GET') {
    const token = readToken(req);
    if (verifyAdminToken(token, secret)) {
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ ok: false });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { password } = req.body || {};
  if (password !== correct) {
    return res.status(401).json({ ok: false });
  }

  const token = createAdminToken(secret);
  return res.status(200).json({
    ok: true,
    token,
    expires_in: TOKEN_TTL_SECONDS,
  });
}
