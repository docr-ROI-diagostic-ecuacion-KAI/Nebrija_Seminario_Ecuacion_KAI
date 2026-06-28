import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/private-reporting";
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();

const data = workbook.worksheets.add("Inscripciones");
const reporting = workbook.worksheets.add("Reporting");
const config = workbook.worksheets.add("Configuracion");

data.showGridLines = false;
reporting.showGridLines = false;
config.showGridLines = false;

const headers = [
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
  "User agent",
];

data.getRange("A1:K1").values = [headers];
data.getRange("A1:K1").format = {
  fill: "#050505",
  font: { bold: true, color: "#FFFFFF" },
  wrapText: true,
};
data.getRange("A2:K501").format = {
  font: { color: "#111827" },
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
data.getRange("A2:A501").format.numberFormat = "yyyy-mm-dd hh:mm";
data.getRange("A:K").format.autofitColumns();
data.getRange("A:A").format.columnWidthPx = 145;
data.getRange("B:B").format.columnWidthPx = 190;
data.getRange("C:C").format.columnWidthPx = 210;
data.getRange("D:D").format.columnWidthPx = 190;
data.getRange("E:F").format.columnWidthPx = 145;
data.getRange("G:H").format.columnWidthPx = 170;
data.getRange("I:K").format.columnWidthPx = 220;
data.freezePanes.freezeRows(1);
data.tables.add("A1:K501", true, "TablaInscripciones");

config.getRange("A1:B1").values = [["Campo", "Valor"]];
config.getRange("A1:B1").format = {
  fill: "#050505",
  font: { bold: true, color: "#FFFFFF" },
};
config.getRange("A2:B12").values = [
  ["Evento", "Seminario Ecuacion KAI ROI v1 - Universidad Nebrija"],
  ["Fecha", "7 de julio"],
  ["Horario", "10:00 a 11:00 h"],
  ["Modalidades", "Presencial | Online"],
  ["Perfiles", "C-level | Profesor/a | Alumno/a | Alumni | Experto/a | Otro"],
  [
    "Consentimiento gestion",
    "He leido y acepto que mis datos se traten exclusivamente para gestionar mi inscripcion al evento y enviarme los correos necesarios para confirmarla y facilitar el acceso, conforme al aviso legal y la politica de privacidad.",
  ],
  [
    "Sin comunicaciones comerciales",
    "Entiendo que esta inscripcion no supone autorizacion para recibir comunicaciones comerciales, newsletters ni acciones promocionales posteriores.",
  ],
  ["Aviso legal", "https://docroi.marketing/aviso-legal/"],
  ["Conservacion", "Eliminar el historico cuando ya no sea necesario para la coordinacion del evento."],
  ["Responsable operativo", "Doc ROI"],
  ["Destino privado", "Google Sheets privado"],
];
config.getRange("A2:A12").format = { font: { bold: true, color: "#111827" } };
config.getRange("B2:B12").format = { wrapText: true };
config.getRange("A:B").format.autofitColumns();
config.getRange("A:A").format.columnWidthPx = 210;
config.getRange("B:B").format.columnWidthPx = 720;
config.freezePanes.freezeRows(1);

reporting.getRange("A1:F1").values = [["Reporting privado de inscripciones", "", "", "", "", ""]];
reporting.getRange("A1:F1").merge();
reporting.getRange("A1:F1").format = {
  fill: "#050505",
  font: { bold: true, color: "#FFFFFF", size: 16 },
};
reporting.getRange("A3:B8").values = [
  ["Metrica", "Valor"],
  ["Total inscripciones", null],
  ["Presencial", null],
  ["Online", null],
  ["Pendiente revisar email", null],
  ["Ultima recepcion", null],
];
reporting.getRange("B4:B8").formulas = [
  ['=COUNTA(Inscripciones!B2:B501)'],
  ['=COUNTIF(Inscripciones!F2:F501,"Presencial")'],
  ['=COUNTIF(Inscripciones!F2:F501,"Online")'],
  ['=COUNTIF(Inscripciones!C2:C501,"")'],
  ['=IFERROR(MAX(Inscripciones!A2:A501),"")'],
];
reporting.getRange("A3:B3").format = {
  fill: "#C8102E",
  font: { bold: true, color: "#FFFFFF" },
};
reporting.getRange("A4:A8").format = { font: { bold: true, color: "#111827" } };
reporting.getRange("B4:B8").format = {
  fill: "#F9FAFB",
  font: { bold: true, color: "#111827" },
};
reporting.getRange("B8").format.numberFormat = "yyyy-mm-dd hh:mm";

reporting.getRange("D3:E9").values = [
  ["Perfil", "Inscripciones"],
  ["C-level", null],
  ["Profesor/a", null],
  ["Alumno/a", null],
  ["Alumni", null],
  ["Experto/a", null],
  ["Otro", null],
];
reporting.getRange("E4:E9").formulas = [
  ['=COUNTIF(Inscripciones!E2:E501,D4)'],
  ['=COUNTIF(Inscripciones!E2:E501,D5)'],
  ['=COUNTIF(Inscripciones!E2:E501,D6)'],
  ['=COUNTIF(Inscripciones!E2:E501,D7)'],
  ['=COUNTIF(Inscripciones!E2:E501,D8)'],
  ['=COUNTIF(Inscripciones!E2:E501,D9)'],
];
reporting.getRange("D3:E3").format = {
  fill: "#C8102E",
  font: { bold: true, color: "#FFFFFF" },
};
reporting.getRange("D4:D9").format = { font: { bold: true, color: "#111827" } };
reporting.getRange("E4:E9").format = { fill: "#F9FAFB" };
reporting.getRange("A3:E9").format.borders = { preset: "all", style: "thin", color: "#D1D5DB" };
reporting.getRange("A:E").format.autofitColumns();
reporting.getRange("A:A").format.columnWidthPx = 210;
reporting.getRange("D:D").format.columnWidthPx = 160;
reporting.freezePanes.freezeRows(1);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "Reporting",
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${outputDir}/reporting-preview.png`, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}/Nebrija_KAI_ROI_Inscripciones_Reporting.xlsx`);
