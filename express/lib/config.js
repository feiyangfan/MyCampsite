import dotenv from "dotenv";
import {cert} from "firebase-admin/app";

dotenv.config();

const firebaseConfig = {
    credential: ''
};
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    firebaseConfig.credential = cert(process.env.GOOGLE_APPLICATION_CREDENTIALS);
}
else if (process.env.GCP_SERVICE_ACCOUNT_KEY_ASC) {
    const key = Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY_ASC, "base64").toString();
    firebaseConfig.credential = cert(JSON.parse(key));
}
export {firebaseConfig};
