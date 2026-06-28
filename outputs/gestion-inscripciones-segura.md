# Gestión segura de inscripciones

La landing pública no debe incluir descarga CSV ni lectura del histórico de inscritos.

## Flujo recomendado

1. La landing envía cada inscripción a un endpoint privado de Google Apps Script.
2. El Apps Script solo permite escritura en una Google Sheet privada.
3. La Google Sheet queda compartida únicamente con Jorge y la coordinadora del evento.
4. El CSV se descarga desde Google Sheets: `Archivo > Descargar > Valores separados por comas (.csv)`.

## Por qué así

- La web pública no expone ningún histórico.
- Ningún visitante puede descargar datos de otros inscritos.
- El endpoint solo añade filas; no devuelve registros.
- La coordinadora trabaja desde Google Sheets, que ya tiene control de permisos e histórico.

## Pendiente antes de publicar

1. Crear la Google Sheet privada.
2. Pegar el código de `google-sheets-apps-script.js` en Apps Script.
3. Desplegar como aplicación web.
4. Copiar la URL `/exec`.
5. Pegar esa URL en `index.html`, constante `REGISTRATION_ENDPOINT`.

Mientras `REGISTRATION_ENDPOINT` esté vacío, el formulario no recoge datos.
