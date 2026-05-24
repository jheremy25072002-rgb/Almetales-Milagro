# Arqueo Recicladora

Web app React + Firebase Firestore para arqueo de turnos y sincronizacion de compras desde MySQL.

Esta copia esta preparada para servir como plantilla de una recicladora nueva. Antes de publicarla, sigue `MIGRACION_NUEVA_RECICLADORA.md` y crea Firebase, GitHub, Vercel, `.env`, credenciales Admin y conexion MySQL independientes.

## Ejecutar localmente

```bash
npm install
npm run server
npm run dev
```

En Windows tambien puedes usar `abrir_app.bat`; abre la API de compras y luego la app web.

## Configuracion

Copia `.env.example` como `.env` y completa las variables nuevas:

```txt
MYSQL_HOST
MYSQL_PORT
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
FIREBASE_PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_ARQUEO_DOCUMENT_ID
```

No uses el `.env` ni el JSON Firebase Admin de otra recicladora.

## Backend Node.js + Express

El backend lee `tbl_consolidado_compras`, calcula el total diario y guarda el resumen en Firestore en:

```txt
compras_diarias/{YYYY-MM-DD}
```

Arrancar API:

```bash
npm run server
```

Endpoints principales:

```txt
GET /health
GET /compras-hoy
GET /compras?fecha=YYYY-MM-DD
GET /compras-opciones
GET /reporte-compras?desde=YYYY-MM-DDTHH:mm&hasta=YYYY-MM-DDTHH:mm&material=CHATARRA&jornada=DIURNA
POST /sync-compras-hoy
POST /sync-compras-rango
```

El servidor sincroniza automaticamente al iniciar y luego cada `SYNC_INTERVAL_SECONDS` segundos.

## Firebase

La app usa Firestore en tiempo real en:

```txt
arqueos/{VITE_ARQUEO_DOCUMENT_ID}
```

PIN inicial del dueno: `1234`.
Clave inicial de empleado: `empleado`.

Activa Firebase Authentication con proveedor anonimo y publica las reglas de `firestore.rules`.

```bash
firebase deploy --only firestore:rules --project ID_FIREBASE_NUEVO
```

## Vercel

1. Sube esta carpeta limpia a un repositorio nuevo.
2. Crea un proyecto nuevo en Vercel y selecciona ese repositorio.
3. Vercel detecta Vite con `vercel.json`.
4. Agrega las variables `VITE_*` nuevas en Vercel.
5. Despliega y guarda la URL nueva.

## Sincronizacion MySQL

Solo una computadora debe tener activa la sincronizacion MySQL -> Firestore. La app web puede seguir publicada en Vercel, pero el backend local que lee MySQL debe quedar encendido en el PC o servidor de la nueva recicladora.

Para que la sincronizacion arranque sola al encender el PC, ejecuta:

```powershell
.\instalar_sincronizacion_inicio.bat
```

Para desactivarla:

```powershell
.\quitar_sincronizacion_inicio.bat
```
