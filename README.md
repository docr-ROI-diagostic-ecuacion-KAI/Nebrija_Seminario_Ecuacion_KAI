# Landing Nebrija · Ecuación KAI·ROI v1

Landing page para el seminario híbrido del 7 de julio en Universidad Nebrija.

## Archivos principales

- `index.html`: landing lista para publicar.
- `outputs/google-sheets-apps-script.js`: receptor de inscripciones para Google Sheets.
- `outputs/gestion-inscripciones-segura.md`: flujo recomendado para gestionar datos sin exponer CSV público.

## Inscripciones

La landing no expone ni descarga datos de inscritos. Antes de publicar, hay que crear una Google Sheet privada, desplegar el Apps Script y pegar la URL `/exec` en `REGISTRATION_ENDPOINT`.
