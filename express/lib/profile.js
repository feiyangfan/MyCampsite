import fetch from "node-fetch";
import PublicProfile from "../models/PublicProfile.js";
import {uploadProfilePic} from "./googlecloud.js";

export const findOrCreateByUID = async (uid) => {
    let profile = await PublicProfile.findOne({uid});
    if (profile)
        return profile;
    else if (!uid)
        return null;
    profile = new PublicProfile({uid});
    await profile.save();
    return profile;
};

export const copyProfilePic = async (payload) => {
    if (typeof payload === "string") {
        try {
            const res = await fetch(payload);
            if (!res.headers.get("Content-Type").startsWith("image/"))
                throw new Error("Image URL doesn't contain an image");
            payload = await res.arrayBuffer();
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    try {
        return (await uploadProfilePic(payload)).publicUrl();
    }
    catch (error) {
        return null;
    }
};
