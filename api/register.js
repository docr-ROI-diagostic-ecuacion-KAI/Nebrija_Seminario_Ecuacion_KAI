const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUjyqZ4BYF7_TKMmU2LlCQ86Y-6D7ua5dvlVJV6WrkEM3OuUBXoFS30ge8EpG2aGbbXQ/exec";
const https = require("https");
const API_VERSION = "2026-06-30-dedupe-1";
const RECENT_WINDOW_MS = 5 * 60 * 1000;
const recentSuccessfulSubmissions = global.__nebrijaRecentSuccessfulSubmissions || new Map();
const inFlightSubmissions = global.__nebrijaInFlightSubmissions || new Map();

global.__nebrijaRecentSuccessfulSubmissions = recentSuccessfulSubmissions;
global.__nebrijaInFlightSubmissions = inFlightSubmissions;

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, service: "Nebrija KAI ROI registration API", version: API_VERSION });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const data = typeof req.body === "string" ? safeJson(req.body) : (req.body || {});
  const dedupeKey = getDedupeKey(data);

  try {
    pruneRecentSubmissions();

    if (dedupeKey && recentSuccessfulSubmissions.has(dedupeKey)) {
      return res.status(200).json({ ok: true, duplicate: true, version: API_VERSION });
    }

    if (dedupeKey && inFlightSubmissions.has(dedupeKey)) {
      await inFlightSubmissions.get(dedupeKey);
      return res.status(200).json({ ok: true, duplicate: true, version: API_VERSION });
    }

    const payload = new URLSearchParams();
    ["fecha", "nombre", "email", "empresa", "perfil", "modalidad", "rgpd", "sin_comercial", "origen", "consentimiento_legal", "user_agent"].forEach((key) => {
      payload.append(key, data[key] || "");
    });

    const writePromise = postUrlEncoded(APPS_SCRIPT_URL, payload.toString());
    if (dedupeKey) inFlightSubmissions.set(dedupeKey, writePromise);

    const scriptResponse = await writePromise;

    if (scriptResponse.statusCode < 200 || scriptResponse.statusCode >= 400) {
      return res.status(502).json({ ok: false, error: "Apps Script error", statusCode: scriptResponse.statusCode, detail: scriptResponse.body.slice(0, 500) });
    }

    if (dedupeKey) recentSuccessfulSubmissions.set(dedupeKey, Date.now());

    return res.status(200).json({ ok: true, version: API_VERSION });
  } catch (error) {
    return res.status(500).json({ ok: false, version: API_VERSION, error: error.message || "Unexpected error" });
  } finally {
    if (dedupeKey) inFlightSubmissions.delete(dedupeKey);
  }
};

function getDedupeKey(data) {
  const email = String(data.email || "").trim().toLowerCase();
  if (email) return `email:${email}`;
  const name = String(data.nombre || "").trim().toLowerCase();
  const company = String(data.empresa || "").trim().toLowerCase();
  return name ? `name:${name}|${company}` : "";
}

function pruneRecentSubmissions() {
  const now = Date.now();
  for (const [key, timestamp] of recentSuccessfulSubmissions.entries()) {
    if (now - timestamp > RECENT_WINDOW_MS) recentSuccessfulSubmissions.delete(key);
  }
}

function safeJson(value) {
  try { return JSON.parse(value || "{}"); } catch { return {}; }
}

function postUrlEncoded(url, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const request = https.request({
      method: "POST",
      hostname: parsedUrl.hostname,
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "Content-Length": Buffer.byteLength(body) }
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        resolve({ statusCode: response.statusCode || 0, body: Buffer.concat(chunks).toString("utf8") });
      });
    });

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}
