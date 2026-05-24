# Migracion a una recicladora nueva

Esta carpeta debe usarse solo como plantilla de codigo e interfaz. No reutilices credenciales, proyectos, repositorios, bases ni URLs de la recicladora anterior.

## 1. Archivos sensibles detectados

- `.env`: contiene conexion MySQL, configuracion del backend y rutas/credenciales Firebase.
- `*firebase-adminsdk*.json`: credencial privada de Firebase Admin. Debe generarse una nueva para este proyecto.
- `.firebaserc`: apuntaba al proyecto Firebase anterior; ahora queda como placeholder.
- `.git/config`: contiene el remoto GitHub anterior y datos de usuario.
- `src/firebase.js`: tenia la configuracion web Firebase anterior; ahora usa variables `VITE_FIREBASE_*`.
- `backend/firebaseAdmin.js`: tenia `projectId` anterior y autodeteccion de credenciales locales; ahora exige `FIREBASE_PROJECT_ID` y credencial explicita.
- `abrir_app_web.bat`: abria la URL Vercel anterior; ahora queda bloqueado hasta reemplazar la URL.
- `logs/`: puede contener datos operativos de la recicladora anterior.
- `dist/`: build viejo que puede contener configuracion publica anterior.

## 2. Limpiar la plantilla antes de crear el proyecto nuevo

Haz una copia de seguridad fuera de esta carpeta si necesitas conservar la app original. En la carpeta nueva, elimina:

```powershell
Remove-Item .env
Remove-Item *firebase-adminsdk*.json
Remove-Item -Recurse -Force .git
Remove-Item -Recurse -Force dist, logs
```

No ejecutes estos comandos en la carpeta original si todavia la necesitas.

## 3. Crear Firebase nuevo

1. Entra a Firebase Console.
2. Crea un proyecto nuevo con nombre de la nueva recicladora/ciudad.
3. Activa Firestore en modo produccion.
4. Activa Authentication y habilita el proveedor anonimo.
5. En configuracion del proyecto, crea una app web.
6. Copia la configuracion web a las variables `VITE_FIREBASE_*` del `.env` nuevo.
7. En Service accounts, genera una nueva clave privada JSON solo para este proyecto.

## 4. Crear el `.env` nuevo

Copia `.env.example` como `.env` y reemplaza todo:

```powershell
Copy-Item .env.example .env
```

Debes completar:

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` con la base MySQL de esta ciudad.
- `FIREBASE_PROJECT_ID` con el id del proyecto Firebase nuevo.
- `GOOGLE_APPLICATION_CREDENTIALS` con la ruta del JSON Firebase Admin nuevo, o usa `FIREBASE_SERVICE_ACCOUNT_JSON` en Vercel/hosting seguro.
- `VITE_FIREBASE_*` con la configuracion de la app web Firebase nueva.
- `VITE_ARQUEO_DOCUMENT_ID` con un identificador corto, por ejemplo `recicladora-cuenca`.

## 5. Probar localmente

Instala dependencias si hace falta:

```powershell
npm install
```

Prueba build del frontend:

```powershell
npm run build
```

Prueba backend:

```powershell
npm run server
```

En otra terminal:

```powershell
Invoke-WebRequest http://localhost:4001/health
Invoke-WebRequest http://localhost:4001/compras-hoy
```

Si falla MySQL, revisa credenciales y que exista la tabla `tbl_consolidado_compras` con columnas `fecha`, `material`, `peso_neto_kg`, `subtotal`, `hora_registro_salida` y `jornada`.

## 6. Publicar reglas Firestore

Edita `.firebaserc` y reemplaza `REEMPLAZAR_PROYECTO_FIREBASE_NUEVO` por el id nuevo.

Luego publica reglas:

```powershell
firebase deploy --only firestore:rules --project ID_FIREBASE_NUEVO
```

## 7. Crear GitHub nuevo

1. Crea un repositorio vacio nuevo en GitHub.
2. Inicializa Git en esta carpeta limpia.
3. Agrega el remoto nuevo.
4. Verifica que `.env` y `*firebase-adminsdk*.json` no se suban.

Comandos orientativos:

```powershell
git init
git remote add origin URL_REPOSITORIO_NUEVO
git status --short
git add .
git commit -m "Crea app de arqueo para nueva recicladora"
git branch -M main
git push -u origin main
```

## 8. Crear Vercel nuevo

1. Crea un proyecto nuevo en Vercel desde el repositorio nuevo.
2. Framework: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Agrega en Vercel las variables de `VERCEL_ENV_VARIABLES.txt`.
6. No agregues credenciales MySQL ni Firebase Admin al frontend de Vercel, salvo que el backend tambien vaya a vivir en un servidor seguro separado.

Para subir primero la app sin MySQL, deja `VITE_API_BASE_URL` vacia. El arqueo funcionara con Firestore; los reportes de compras conectados a MySQL quedan para el final.

## 9. Sincronizacion MySQL

Solo un PC/servidor debe ejecutar `npm run server` o `iniciar_sincronizacion_mysql.bat`, porque ese proceso lee MySQL y escribe en Firestore.

Cuando este probado:

```powershell
.\instalar_sincronizacion_inicio.bat
```

## 10. Lista final de verificacion

- La app local abre sin mencionar el proyecto Firebase anterior.
- Firestore nuevo tiene `arqueos/{VITE_ARQUEO_DOCUMENT_ID}`.
- Firestore nuevo tiene `compras_diarias/{YYYY-MM-DD}` despues de sincronizar.
- GitHub remoto apunta al repositorio nuevo.
- Vercel apunta al proyecto nuevo y URL nueva.
- No existe `.env`, JSON Admin, `logs/`, `dist/` viejo ni `.git` anterior en el repo publicado.
