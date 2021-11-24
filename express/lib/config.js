import dotenv from "dotenv";
import {cert} from "firebase-admin/app";

dotenv.config();

const firebaseConfig = {};
const cloudStorageConfig = {};
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credential = cert(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    firebaseConfig.credential = credential;
    cloudStorageConfig.credential = credential;
}
else if (process.env.GCP_SERVICE_ACCOUNT_KEY_ASC) {
    const key = Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY_ASC, "base64").toString();
    const credential = cert(JSON.parse(key));
    firebaseConfig.credential = credential;
    cloudStorageConfig.credential = credential;
}
export {firebaseConfig, cloudStorageConfig};

const prod = process.env.NODE_ENV === "production";
export const env = {
    resourcePrefix: prod ? "prod" : "devel"
};

export const cloudStorageBucket = {
    profilePics: `${env.resourcePrefix}-profile-pics-my-campsite-329022`,
    postBlobs: `${env.resourcePrefix}-post-blob-my-campsite-329022`
};
