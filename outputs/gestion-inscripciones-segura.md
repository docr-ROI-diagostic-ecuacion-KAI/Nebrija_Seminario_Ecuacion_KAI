# Gestion segura de inscripciones

Ya esta creada la Google Sheet privada:

https://docs.google.com/spreadsheets/d/1MEAbTTBS0oiubJloIPZawpwVAHjc4GgQfG4O-G4KfjE/edit

## Que contiene

- `Inscripciones`: historico privado de altas del formulario.
- `Reporting`: resumen automatico por total, modalidad y perfil.
- `Configuracion`: datos del evento, textos legales y criterio de conservacion.

## Activar la captura desde la landing

1. Abre la hoja privada.
2. En Google Sheets, ve a `Extensiones > Apps Script`.
3. Borra lo que aparezca y pega el contenido de `outputs/google-sheets-apps-script.js`.
4. Pulsa `Implementar > Nueva implementacion`.
5. Tipo: `Aplicacion web`.
6. Ejecutar como: `Yo`.
7. Acceso: `Cualquier usuario`.
8. Copia la URL que termina en `/exec`.
9. Pegala en `index.html`, constante `REGISTRATION_ENDPOINT`.

Mientras `REGISTRATION_ENDPOINT` este vacio, la landing no guarda datos.

## Como exportar CSV para la coordinadora

Desde Google Sheets:

`Archivo > Descargar > Valores separados por comas (.csv)`

Hazlo desde la pestana `Inscripciones`.

## Seguridad

- La landing publica no tiene boton de descarga CSV.
- La web no lee el historico de inscritos.
- El endpoint solo anade filas a la hoja privada.
- Los datos se usan exclusivamente para confirmar la inscripcion y facilitar el acceso al evento.
- Esta inscripcion no autoriza comunicaciones comerciales posteriores.
- Cuando deje de ser necesario para coordinar el evento, se debe eliminar el historico.
