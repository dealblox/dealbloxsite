/**
 * ============================================================
 *  DEAL BLOX — Configurações Centrais (Frontend)
 * ============================================================
 *
 *  Aqui ficam APENAS variáveis seguras para o frontend.
 *  Chaves secretas (Resend, Supabase, Admin) ficam SOMENTE
 *  no Vercel → Settings → Environment Variables.
 *
 * ============================================================
 */

const LAGTECK_CONFIG = {

  // ----------------------------------------------------------
  //  MERCADO PAGO — Public Key (seguro expor no frontend)
  // ----------------------------------------------------------
  MP_PUBLIC_KEY: "APP_USR-6cdf5985-045e-4a34-830d-6be9bfd40220",

  // ----------------------------------------------------------
  //  AUTENTICAÇÃO GOOGLE (OAuth)
  // ----------------------------------------------------------
  GOOGLE_CLIENT_ID: "188362380531-9vfbjigk0ieu41aqrnc9e001rkh93qrh.apps.googleusercontent.com",

  // ----------------------------------------------------------
  //  AUTENTICAÇÃO DISCORD (OAuth2)
  // ----------------------------------------------------------
  DISCORD_CLIENT_ID: "1464057901739151454",
  DISCORD_REDIRECT_URI: window.location.origin + "/auth-callback.html",

  // ----------------------------------------------------------
  //  DISCORD DO SUPORTE
  // ----------------------------------------------------------
  DISCORD_SERVER: "https://discord.gg/rPFN7BMC5k",

  // ----------------------------------------------------------
  //  INFORMAÇÕES DO SITE
  // ----------------------------------------------------------
  SITE_NAME: "Deal Blox",
  SITE_URL: "https://dealblox.com.br",
  SUPPORT_EMAIL: "dealblox.suporte@gmail.com",
  SITE_DESCRIPTION: "Loja digital de contas e itens de Blox Fruits. Compre com segurança e entrega rápida.",
};

Object.freeze(LAGTECK_CONFIG);