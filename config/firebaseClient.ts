import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId:process.env.PROJECT_ID,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const clientAuth = getAuth(app);

export { clientAuth };