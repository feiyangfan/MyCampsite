import PublicProfile from "../models/PublicProfile.js";
import {findOrCreateByUser, copyProfilePic} from "../lib/profile.js";

export const getProfile = async (req, res, next) => {
    const {params: {id}, user} = req;

    if (!id && !user?.uid)
        return res.sendStatus(401);

    try {
        const profile = id ? await PublicProfile.findById(id) : await findOrCreateByUser(user);
        if (profile.uid === user?.uid) {
            profile.private = {
                email: req.user?.email,
                emailVerified: req.user?.emailVerified
            };
        }
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

export const setProfile = async (req, res, next) => {
    const {params: {id}, body, user} = req;

    try {
        let profile = id ? await PublicProfile.findById(id) : await findOrCreateByUser(user);
        if (profile.uid !== user?.uid)
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
