/**
 * ============================================================
 *  LAG TECK — Configurações Centrais
 * ============================================================
 *
 *  ⚠️  IMPORTANTE: Preencha as variáveis abaixo antes de subir
 *      para produção (Vercel / GitHub).
 *
 *  Para usar variáveis de ambiente no Vercel:
 *  → Dashboard do Vercel > Settings > Environment Variables
 *  → Adicione cada variável e referencie via window.__ENV__ ou
 *    substitua diretamente os valores abaixo no seu CI/CD.
 *
 * ============================================================
 */

const LAGTECK_CONFIG = {

  // ----------------------------------------------------------
  //  MERCADO PAGO
  //  → Obtenha em: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/landing
  //  → Token público (Public Key) — usado no frontend (seguro expor)
  //  → Token privado (Access Token) — NÃO coloque aqui, use backend/webhook
  // ----------------------------------------------------------
  MP_PUBLIC_KEY: "APP_USR-6658413354375969-091020-016348bf744fb52a4f92ac24b525b8cd-1281760812",

  // ----------------------------------------------------------
  //  EMAIL DE ENVIO DE VERIFICAÇÃO
  //  → O envio de email REAL precisa de um serviço de backend.
  //    Neste projeto estático, recomendamos usar EmailJS:
  //    → Cadastre-se em: https://www.emailjs.com/
  //    → Crie um serviço Gmail com a conta lagteck@gmail.com
  //    → Crie um template com variáveis: {{to_email}}, {{code}}, {{name}}
  //    → Preencha as 3 variáveis abaixo:
  // ----------------------------------------------------------
  EMAILJS_SERVICE_ID: "service_mzmityx",
  EMAILJS_TEMPLATE_ID: "template_6ztpr7k",
  EMAILJS_PUBLIC_KEY: "7SAN7fAAsYLc7e-6W",

  // ----------------------------------------------------------
  //  AUTENTICAÇÃO GOOGLE (OAuth)
  //  → Cadastre em: https://console.cloud.google.com/
  //  → Crie um projeto > Credenciais > ID do cliente OAuth 2.0
  //  → Tipo: Aplicativo da Web
  //  → Origens JS autorizadas: https://seudominio.vercel.app
  // ----------------------------------------------------------
  GOOGLE_CLIENT_ID: "729833314816-gcarso1kti1rqnu1kddrfus0d6m7260p.apps.googleusercontent.com",

  // ----------------------------------------------------------
  //  AUTENTICAÇÃO DISCORD (OAuth2)
  //  → Cadastre em: https://discord.com/developers/applications
  //  → Crie uma aplicação > OAuth2 > Client ID
  //  → Redirect URI: https://seudominio.vercel.app/auth-callback.html
  //  → IMPORTANTE: O fluxo de Discord OAuth requer backend para
  //    trocar o code pelo token. Para produção, use Vercel Functions.
  //    Por ora, está implementado como placeholder funcional.
  // ----------------------------------------------------------
  DISCORD_CLIENT_ID: "1464057901739151454",
  DISCORD_REDIRECT_URI: window.location.origin + "/auth-callback.html",

  // ----------------------------------------------------------
  //  PAINEL ADMIN
  //  → Senha de acesso ao painel administrativo
  //  → TROQUE para uma senha forte antes de ir ao ar!
  // ----------------------------------------------------------
  ADMIN_PASSWORD: "lagteck@admin2026",

  // ----------------------------------------------------------
  //  DISCORD DO SUPORTE
  //  → Link do servidor Discord para suporte
  // ----------------------------------------------------------
  DISCORD_SERVER: "https://discord.gg/rPFN7BMC5k",

  // ----------------------------------------------------------
  //  INFORMAÇÕES DO SITE
  // ----------------------------------------------------------
  SITE_NAME: "Lag Teck",
  SITE_URL: "https://lagteck.vercel.app",
  SUPPORT_EMAIL: "lagteck@gmail.com",
  SITE_DESCRIPTION: "Loja digital de contas e itens de Blox Fruits. Compre com segurança e entrega rápida.",
};

// Previne modificação acidental das configurações
Object.freeze(LAGTECK_CONFIG);
