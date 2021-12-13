import fetch from "node-fetch";
import PublicProfile from "../models/PublicProfile.js";
import {authenticate, uploadProfilePic} from "./googlecloud.js";
import Permission from "../models/Permission.js";

/**
 * Find or create a profile. When creating new profiles, user info is copied from the Firebase user
 * @param user Firebase user
 * @returns Promise<PublicProfile>
 */
export const findOrCreateByUser = async (user) => {
    let profile = await PublicProfile.findOne({uid: user?.uid});
    if (profile)
        return profile;
    else if (!user)
        return null;

    profile = new PublicProfile({
        uid: user.uid,
        displayName: user.displayName,
        profilePicURL: user.photoURL ? await copyProfilePic(user.photoURL) : null
    });
    await profile.save();
    return profile;
};

/**
 * Copies profile pic to cloud storage
 * @param payload url or buffer
 * @returns {Promise<string>}
 */
export const copyProfilePic = async (payload) => {
    if (typeof payload === "string") {
        const res = await fetch(payload);
        if (!res.headers.get("Content-Type").startsWith("image/"))
            throw new Error("Image URL doesn't contain an image");
        payload = Buffer.from(await res.arrayBuffer());
    }

    return (await uploadProfilePic(payload)).publicUrl();
};

/**
 * Query the authenticated user's profile and store in <code>request.profile</code>
 * @param must Send error response if not authenticated
 * @param mustAdmin Send error response if user is not admin
 */
export const getProfile = (must = false, mustAdmin = false) => [
    authenticate(must),
    async (req, res, next) => {
        try {
            req.profile = await findOrCreateByUser(req.user);

            const perms = await Permission.findOne({profile: req.profile});
            if (perms?.admin)
                req.admin = true;
            else if (mustAdmin)
                return res.sendStatus(403);
            else
                req.admin = false;
        }
        catch (error) {
            next(error);
        }
        next();
    }
];
