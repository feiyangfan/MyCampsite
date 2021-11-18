import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {Storage} from "@google-cloud/storage";
import {v4 as uuid} from "uuid";
import {cloudStorageConfig, firebaseConfig, cloudStorageBucket} from "./config.js";

const app = initializeApp(firebaseConfig);
const storage = new Storage(cloudStorageConfig);

export const authenticate = (must = false, admin = false) =>
    async (req, res, next) => {
        const auth = getAuth();
        const idToken = req.get("X-Firebase-IDToken");
        if (idToken) {
            const token = await auth
                .verifyIdToken(idToken)
                .catch(error => {
                    console.log(error.message);
                });

            req.user = await auth.getUser(token.uid);
            // TODO admin check
        }
        else {
            req.user = null;
            if (must)
                return res.sendStatus(401);
        }
        next();
    };

export const uploadProfilePic = async (buf) => {
    const bucket = storage.bucket(cloudStorageBucket.profilePics);
    let file, fileExists;
    do {
        file = bucket.file(uuid());
        [fileExists] = await file.exists();
    } while (fileExists);

    await file.save(buf);
    return file;
};
