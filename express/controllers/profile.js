import PublicProfile from "../models/PublicProfile.js";
import {findOrCreateByUID, copyProfilePic} from "../lib/profile.js";

export const getProfile = async (req, res, next) => {
    const id = req.params.id;
    const uid = req.auth?.uid;

    if (!id && !uid)
        return res.sendStatus(401);

    try {
        const profile = id ? await PublicProfile.findById(id) : await findOrCreateByUID(uid);
        if (profile.uid === req.auth?.uid) {
            profile.private = {
                email: req.auth?.email,
                emailVerified: req.auth?.emailVerified
            };
        }
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

export const setProfile = async (req, res, next) => {
    const {
        params: {id},
        body
    } = req;
    const uid = req.auth?.uid;

    try {
        let profile = id ? await PublicProfile.findById(id) : await findOrCreateByUID(uid);
        if (profile.uid !== req.auth?.uid)
            return res.sendStatus(403);

        if (body.displayName)
            profile.displayName = body.displayName;
        if (body.profilePicURL)
            profile.profilePicURL = await copyProfilePic(body.profilePicURL);
        if (body.profilePicAsc)
            profile.profilePicURL = await copyProfilePic(Buffer.from(body.profilePicAsc, "base64"));
        await profile.save();

        await getProfile(req, res, next);
    } catch (error) {
        next(error);
    }
};
