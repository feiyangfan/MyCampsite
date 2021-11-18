import fetch from "node-fetch";
import PublicProfile from "../models/PublicProfile.js";
import {uploadProfilePic} from "./googlecloud.js";

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
