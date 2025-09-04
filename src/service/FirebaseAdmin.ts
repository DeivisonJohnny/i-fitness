import * as FireAdmin from "firebase-admin";

if (!FireAdmin.apps.length) {
  try {
    FireAdmin.initializeApp({
      credential: FireAdmin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      }),
    });
    console.log("Firebase FireAdmin SDK inicializado com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar o Firebase FireAdmin SDK:", error);
  }
}

export default FireAdmin;
