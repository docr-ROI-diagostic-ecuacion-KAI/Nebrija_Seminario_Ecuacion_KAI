const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUjyqZ4BYF7_TKMmU2LlCQ86Y-6D7ua5dvlVJV6WrkEM3OuUBXoFS30ge8EpG2aGbbXQ/exec";
const https = require("https");

module.exports = async function handler(req, res) {
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

    if (scriptResponse.statusCode < 200 || scriptResponse.statusCode >= 300) {
      return res.status(502).json({
        ok: false,
        error: "Apps Script error",
        statusCode: scriptResponse.statusCode,
        detail: scriptResponse.body.slice(0, 500)
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || "Unexpected error" });
  }
};

function postUrlEncoded(url, body, redirectCount = 0) {
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
        const location = response.headers.location;

        if (location && response.statusCode >= 300 && response.statusCode < 400 && redirectCount < 5) {
          try {
            const nextUrl = new URL(location, url).toString();
            resolve(await postUrlEncoded(nextUrl, body, redirectCount + 1));
          } catch (error) {
            reject(error);
          }
          return;
        }

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
