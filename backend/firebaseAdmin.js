import admin from 'firebase-admin';
import fs from 'node:fs';

const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error('Falta la variable de entorno FIREBASE_PROJECT_ID.');
}

function credential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  const credentialPath = resolveCredentialPath();
  if (credentialPath) {
    return admin.credential.cert(JSON.parse(fs.readFileSync(credentialPath, 'utf8')));
  }

  throw new Error('Configura GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_SERVICE_ACCOUNT_JSON para Firebase Admin.');
}

function resolveCredentialPath() {
  const configuredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (configuredPath && fs.existsSync(configuredPath)) return configuredPath;
  if (configuredPath) {
    throw new Error(`No existe la credencial Firebase Admin indicada en GOOGLE_APPLICATION_CREDENTIALS: ${configuredPath}`);
  }
  return '';
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: credential(),
    projectId
  });
}

export const firestore = admin.firestore();
