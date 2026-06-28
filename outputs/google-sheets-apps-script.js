// Google Apps Script para recibir inscripciones desde la landing KAI ROI Nebrija.
// Pegar en https://script.google.com/ o en Extensiones > Apps Script desde la hoja.
// Hoja privada ya creada:
// https://docs.google.com/spreadsheets/d/1MEAbTTBS0oiubJloIPZawpwVAHjc4GgQfG4O-G4KfjE/edit

const SPREADSHEET_ID = "1MEAbTTBS0oiubJloIPZawpwVAHjc4GgQfG4O-G4KfjE";
const SHEET_NAME = "Inscripciones";

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents || "{}");

  sheet.appendRow([
    data.fecha || new Date().toISOString(),
    data.nombre || "",
    data.email || "",
    data.empresa || "",
    data.perfil || "",
    data.modalidad || "",
    data.rgpd || "",
    data.sin_comercial || "",
    data.origen || "landing-nebrija-kai-roi",
    data.consentimiento_legal || "",
    data.user_agent || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
