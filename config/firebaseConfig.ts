import { initializeApp, cert, ServiceAccount,AppOptions, App , getApps} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import * as dotenv from 'dotenv';
dotenv.config();

const getFirebaseConfig = (): AppOptions => {
   

    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
        process.env;
    
    if (
        !FIREBASE_PROJECT_ID ||
        !FIREBASE_CLIENT_EMAIL ||
        !FIREBASE_PRIVATE_KEY
    ) {
      
        throw new Error(
            "Missing Firebase configuaration. Please check your environment variables"
        );
    }

    const serviceAccount: ServiceAccount = {
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
   
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };

    return {
        credential: cert(serviceAccount),
    };
};
const initializeFirebase = (): App => {
    
    const existing: App = getApps()[0];

    if (existing) return existing;
    

    return initializeApp(getFirebaseConfig());
};


const app: App = initializeFirebase();

const auth: Auth = getAuth(app);

const db: Firestore = getFirestore(app);

export { auth, db };

