// Google Apps Script para recibir inscripciones desde la landing KAI ROI Nebrija.
// Pegar en https://script.google.com/ o en Extensiones > Apps Script desde la hoja.
// Hoja privada:
// https://docs.google.com/spreadsheets/d/1MEAbTTBS0oiubJloIPZawpwVAHjc4GgQfG4O-G4KfjE/edit

const SPREADSHEET_ID = "1MEAbTTBS0oiubJloIPZawpwVAHjc4GgQfG4O-G4KfjE";
const SHEET_NAME = "Inscripciones";

const HEADERS = [
  "Fecha recepcion",
  "Nombre y apellidos",
  "Email profesional",
  "Empresa o institucion",
  "Perfil profesional",
  "Modalidad",
  "Acepta gestion inscripcion",
  "Entiende sin comunicaciones comerciales",
  "Origen",
  "Consentimiento legal",
  "User agent"
];

function doGet() {
  return jsonOutput({
    ok: true,
    message: "Endpoint activo. Usa testDoPost() para probar escritura en la hoja.",
    spreadsheetId: SPREADSHEET_ID,
    sheet: getTargetSheet_().getName()
  });
}

function doPost(e) {
  try {
    const data = readPayload_(e);
    const sheet = getTargetSheet_();
    ensureHeaders_(sheet);

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

    return jsonOutput({ ok: true, inserted: true, sheet: sheet.getName() });
  } catch (error) {
    console.error(error);
    return jsonOutput({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function testDoPost() {
  const result = doPost({
    postData: {
      contents: JSON.stringify({
        fecha: new Date().toISOString(),
        nombre: "Prueba tecnica",
        email: "prueba@example.com",
        empresa: "Doc ROI",
        perfil: "Test",
        modalidad: "Online",
        rgpd: "si",
        sin_comercial: "si",
        origen: "test-apps-script",
        consentimiento_legal: "Prueba manual desde Apps Script",
        user_agent: "Apps Script"
      })
    },
    parameter: {}
  });
  Logger.log(result.getContent());
}

function getTargetSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
}

function ensureHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = firstRow.some(function(value) {
    return String(value || "").trim() !== "";
  });

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return;
  }

  const missingHeaders = HEADERS.some(function(header, index) {
    return String(firstRow[index] || "").trim() === "";
  });

  if (missingHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function readPayload_(e) {
  const contents = e && e.postData && e.postData.contents ? e.postData.contents : "";
  if (contents) {
    try {
      return JSON.parse(contents);
    } catch (error) {
      return parseUrlEncoded_(contents);
    }
  }
  return e && e.parameter ? e.parameter : {};
}

function parseUrlEncoded_(text) {
  return text.split("&").reduce(function(result, pair) {
    const parts = pair.split("=");
    const key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
    const value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
    if (key) result[key] = value;
    return result;
  }, {});
}

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
