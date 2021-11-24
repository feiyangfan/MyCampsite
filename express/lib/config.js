import dotenv from "dotenv";
import {initializeApp, cert} from "firebase-admin/app";
import {Storage} from "@google-cloud/storage";

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

const app = initializeApp(firebaseConfig);
const storage = new Storage(cloudStorageConfig);

const env = process.env.NODE_ENV;
const resourcePrefix = env === "production" ? "prod" : "devel";

export const cloudStorageBucket = {
    profilePics: storage.bucket(`${resourcePrefix}-profile-pics-my-campsite-329022`),
    postBlobs: storage.bucket(`${resourcePrefix}-post-blob-my-campsite-329022`)
};
