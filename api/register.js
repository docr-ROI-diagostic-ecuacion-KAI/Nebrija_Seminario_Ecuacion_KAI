const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUjyqZ4BYF7_TKMmU2LlCQ86Y-6D7ua5dvlVJV6WrkEM3OuUBXoFS30ge8EpG2aGbbXQ/exec";

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

    const scriptResponse = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: payload.toString(),
      redirect: "follow"
    });

    if (!scriptResponse.ok) {
      const text = await scriptResponse.text();
      return res.status(502).json({ ok: false, error: "Apps Script error", detail: text.slice(0, 500) });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || "Unexpected error" });
  }
};
