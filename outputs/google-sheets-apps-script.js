// Google Apps Script para recibir inscripciones desde la landing KAI ROI Nebrija.
// Uso:
// 1. Crea un Google Sheet con columnas:
// fecha, nombre, email, empresa, perfil, modalidad, rgpd, sin_comercial
// 2. Extensiones > Apps Script.
// 3. Pega este codigo y cambia SHEET_NAME si tu pestana tiene otro nombre.
// 4. Implementar > Nueva implementacion > Aplicacion web.
// 5. Acceso: cualquiera con el enlace.
// 6. Copia la URL /exec y pegala en index.html, constante REGISTRATION_ENDPOINT.

const SHEET_NAME = "Inscripciones";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.fecha || new Date().toISOString(),
    data.nombre || "",
    data.email || "",
    data.empresa || "",
    data.perfil || "",
    data.modalidad || "",
    data.rgpd || "",
    data.sin_comercial || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
