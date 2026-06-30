const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUjyqZ4BYF7_TKMmU2LlCQ86Y-6D7ua5dvlVJV6WrkEM3OuUBXoFS30ge8EpG2aGbbXQ/exec";
const https = require("https");
const API_VERSION = "2026-06-30-diagnostic-1";

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query && req.query.test === "1") {
      return runDiagnosticWrite(res);
    }

    return res.status(200).json({
      ok: true,
      service: "Nebrija KAI ROI registration API",
      version: API_VERSION,
      diagnostic: "Open /api/register?test=1 to send one clearly labelled test row to Google Sheets."
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const payload = new URLSearchParams();

    [
      "fecha",
      "nombre",
      "email",
      "empresa",
      "perfil",
      "modalidad",
      "rgpd",
      "sin_comercial",
      "origen",
      "consentimiento_legal",
      "user_agent"
    ].forEach((key) => {
      payload.append(key, data[key] || "");
    });

    const scriptResponse = await postUrlEncoded(APPS_SCRIPT_URL, payload.toString());

    if (scriptResponse.statusCode < 200 || scriptResponse.statusCode >= 400) {
      return res.status(502).json({
        ok: false,
        error: "Apps Script error",
        statusCode: scriptResponse.statusCode,
        detail: scriptResponse.body.slice(0, 500)
      });
    }

    return res.status(200).json({ ok: true, version: API_VERSION });
  } catch (error) {
    return res.status(500).json({ ok: false, version: API_VERSION, error: error.message || "Unexpected error" });
  }
};

async function runDiagnosticWrite(res) {
  const stamp = new Date().toISOString();
  const payload = new URLSearchParams({
    fecha: stamp,
    nombre: "Diagnostico servidor Vercel",
    email: `diagnostico-${Date.now()}@docroi.local`,
    empresa: "Doc ROI",
    perfil: "Test tecnico",
    modalidad: "Online",
    rgpd: "si",
    sin_comercial: "si",
    origen: "api-register-diagnostic",
    consentimiento_legal: "Prueba tecnica de escritura desde Vercel",
    user_agent: `Vercel API ${API_VERSION}`
  });

  try {
    const scriptResponse = await postUrlEncoded(APPS_SCRIPT_URL, payload.toString());
    const ok = scriptResponse.statusCode >= 200 && scriptResponse.statusCode < 400;

    return res.status(ok ? 200 : 502).json({
      ok,
      version: API_VERSION,
      appsScriptStatus: scriptResponse.statusCode,
      detail: scriptResponse.body.slice(0, 500)
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      version: API_VERSION,
      error: error.message || "Unexpected diagnostic error"
    });
  }
}

function postUrlEncoded(url, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const request = https.request({
      method: "POST",
      hostname: parsedUrl.hostname,
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Content-Length": Buffer.byteLength(body)
      }
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        const responseBody = Buffer.concat(chunks).toString("utf8");
        resolve({
          statusCode: response.statusCode || 0,
          body: responseBody
        });
      });
    });

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}
