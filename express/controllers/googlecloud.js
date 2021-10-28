import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {firebaseConfig} from "../lib/config.js";

const app = initializeApp(firebaseConfig);
console.log(`Firebase initialized: ${app.name}`);

export const authenticate = (must = false, admin = false) =>
    async (req, res, next) => {
        const idToken = req.get("X-Firebase-IDToken");
        if (idToken) {
            const token = await getAuth()
                .verifyIdToken(idToken)
                .catch(error => {
                    console.log(error.message);
                });

            req.auth = {
                uid: token.uid,
                emailVerified: token.email_verified
            };
            // TODO admin check
        }
        else {
            req.auth = null
            if (must)
                return res.sendStatus(401)
        }
        next()
    };
