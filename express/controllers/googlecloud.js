import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

initializeApp();

export const authenticate = async (req, res, next) => {
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
        console.log("ye boi: " + req.auth.toString());
    }
    else
        req.auth = null;

    next();
};
