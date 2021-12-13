import dotenv from "dotenv";
import {initializeApp, cert} from "firebase-admin/app";
import {Storage} from "@google-cloud/storage";

dotenv.config();

const firebaseConfig = {};
const cloudStorageConfig = {};
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log(`Using GCP service account credential: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
}
else if (process.env.GCP_SERVICE_ACCOUNT_KEY_ASC) {
    console.log("Loading GCP service account credential from environment");
    const decoded = Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY_ASC, "base64").toString();
    const key = JSON.parse(decoded);
    firebaseConfig.credential = cert(key);
    cloudStorageConfig.projectId = key.project_id;
    cloudStorageConfig.credentials = key;
}
else
    throw new Error("Missing GCP service account credential");
export {firebaseConfig, cloudStorageConfig};

const app = initializeApp(firebaseConfig);
const storage = new Storage(cloudStorageConfig);

let resourcePrefix;
switch (process.env.NODE_ENV) {
    case "production":
        resourcePrefix = "prod-d2";
        break;
    case "prod-d3":
        resourcePrefix = "prod-d3";
        break;
    default:
        resourcePrefix = "devel";
        break;
}

export const cloudStorageBucket = {
    profilePics: storage.bucket(`${resourcePrefix}-profile-pics-my-campsite-329022`),
    postBlobs: storage.bucket(`${resourcePrefix}-post-blob-my-campsite-329022`)
};

export const weatherAPIKey = process.env.OPEN_WEATHER_MAP_KEY;
export const weatherBaseURL = "https://api.openweathermap.org/data/2.5";
