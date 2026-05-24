# Pendiente para conectar MySQL

La app web ya funciona en Vercel con Firestore aunque esta PC este apagada.

Manana solo falta configurar esta PC como sincronizador MySQL -> Firestore.

## Datos que faltan

Pedir estos datos de la base MySQL:

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

Tambien hace falta una credencial nueva de Firebase Admin del proyecto `almetales-milagro`.

## Donde van

Editar `.env` y llenar:

```txt
MYSQL_HOST=
MYSQL_PORT=3306
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=

FIREBASE_PROJECT_ID=almetales-milagro
FIRESTORE_COMPRAS_COLLECTION=compras_diarias
GOOGLE_APPLICATION_CREDENTIALS=C:\ruta\a\almetales-milagro-admin.json
```

El JSON Admin no se sube a GitHub. `.gitignore` ya lo protege si el nombre contiene `firebase-adminsdk`.

## Prueba manual

```powershell
npm install
npm run server
```

En otra terminal:

```powershell
Invoke-WebRequest http://127.0.0.1:4000/health
Invoke-WebRequest http://127.0.0.1:4000/compras-hoy
```

Luego revisar Firestore:

```txt
compras_diarias/{YYYY-MM-DD}
```

## Dejar encendido automatico

Cuando la prueba manual funcione:

```powershell
.\instalar_sincronizacion_inicio.bat
```

Eso crea una tarea de Windows para arrancar la sincronizacion al iniciar sesion.

## Importante

No hace falta cambiar Vercel manana. La app publicada lee las compras desde Firestore. Esta PC solo sincroniza MySQL hacia Firestore.
