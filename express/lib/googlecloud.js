import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {Storage} from "@google-cloud/storage";
import {v4 as uuid} from "uuid";
import {cloudStorageConfig, firebaseConfig, cloudStorageBucket} from "./config.js";

const app = initializeApp(firebaseConfig);
const storage = new Storage(cloudStorageConfig);

/**
 * Authenticates user and retrieves user info. <br>
 * If user is authenticated, its info is stored in <code>request.user</code>
 * @param must Send error response if not authenticated
 */
export const authenticate = (must = false) =>
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
        }
        else {
            req.user = null;
            if (must)
                return res.sendStatus(401);
        }
        next();
    };

export const getEmptyFile = async (bucketName) => {
    const bucket = storage.bucket(bucketName);
    let file, fileExists;
    do {
        file = bucket.file(uuid());
        [fileExists] = await file.exists();
    } while (fileExists);

    return file;
};

/**
 * Create new file on cloud storage and copy data
 * @param buf
 * @returns {Promise<File>}
 */
export const uploadProfilePic = async (buf) => {
    const file = await getEmptyFile(cloudStorageBucket.profilePics);
    await file.save(buf);
    return file;
};
