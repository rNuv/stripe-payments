import * as firebaseAdmin from 'firebase-admin';
import serviceAccount from '../service-account.js'

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();