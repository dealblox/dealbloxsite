/**
 * DEAL BLOX — /api/geo
 * Retorna dados de geolocalização do IP do visitante.
 * Chamado pelo frontend para pegar IP, cidade, país, ISP.
 * Roda no servidor (Vercel), sem restrição de CORS/HTTPS.
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
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Pega IP real do visitante (Vercel passa nos headers)
  const ip =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "";

  if (!ip) {
    return res.status(200).json({ ip: "", city: "", region: "", country: "", isp: "" });
  }

  try {
    // ip-api.com funciona HTTP no servidor sem problema nenhum
    const geoRes = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,query,city,regionName,country,isp`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (geoRes.ok) {
      const geo = await geoRes.json();
      if (geo.status === "success") {
        return res.status(200).json({
          ip:      geo.query      || ip,
          city:    geo.city       || "",
          region:  geo.regionName || "",
          country: geo.country    || "",
          isp:     geo.isp        || "",
        });
      }
    }
  } catch (err) {
    console.warn("[geo] ip-api.com falhou:", err.message);
  }

  // Fallback: ipwho.is (HTTPS, funciona no servidor)
  try {
    const g2 = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(5000) });
    if (g2.ok) {
      const geo2 = await g2.json();
      if (geo2.success) {
        return res.status(200).json({
          ip:      geo2.ip                  || ip,
          city:    geo2.city                || "",
          region:  geo2.region              || "",
          country: geo2.country             || "",
          isp:     geo2.connection?.isp     || "",
        });
      }
    }
  } catch (err) {
    console.warn("[geo] ipwho.is falhou:", err.message);
  }

  return res.status(200).json({ ip, city: "", region: "", country: "", isp: "" });
}