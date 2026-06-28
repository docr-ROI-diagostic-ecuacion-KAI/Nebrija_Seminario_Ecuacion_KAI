# Landing Nebrija · Ecuación KAI·ROI v1

Landing page para el seminario híbrido del 7 de julio en Universidad Nebrija.

## Archivos principales

- `index.html`: landing lista para publicar.
- `outputs/google-sheets-apps-script.js`: receptor de inscripciones para Google Sheets.
- `outputs/gestion-inscripciones-segura.md`: flujo para gestionar datos sin exponer CSV público.
- `tools/build_registration_reporting.mjs`: generador de la plantilla privada de reporting.

## Inscripciones

La landing no expone ni descarga datos de inscritos. La Google Sheet privada creada para el reporting es:

https://docs.google.com/spreadsheets/d/1MEAbTTBS0oiubJloIPZawpwVAHjc4GgQfG4O-G4KfjE/edit

Para activar la captura real hay que desplegar el Apps Script como aplicación web y pegar la URL `/exec` en `REGISTRATION_ENDPOINT`.
