import {Router} from "express";
import bodyParser from "body-parser";
import PublicProfile from "../models/PublicProfile.js";
import {authenticate} from "../lib/googlecloud.js";
import {findOrCreateByUser, copyProfilePic} from "../lib/profile.js";
import Permission from "../models/Permission.js";

const router = Router();
router.use(bodyParser.json());

const profileResponse = async (req, res, next) => {
    const {params: {id}, user} = req;

    if (!id && !user?.uid)
        return res.sendStatus(401);

    try {
        const profile = id ? await PublicProfile.findById(id) : await findOrCreateByUser(user);
        const body = {
            id: profile.id,
            uid: profile.uid,
            displayName: profile.displayName,
            profilePicURL: profile.profilePicURL,
            creationDate: profile.creationDate
        };

        if (profile.uid === user?.uid) {
            body.private = {
                email: req.user?.email,
                emailVerified: req.user?.emailVerified
            };
        }

        const perms = await Permission.findOne({profile});
        body.admin = perms?.admin === true;

        res.json(body);
    }
    catch (error) {
        next(error);
    }
};

router.get("/:id?", authenticate(), profileResponse);

const setProfile = async (req, res, next) => {
    const {params: {id}, body, user} = req;

    try {
        let profile = id ? await PublicProfile.findById(id) : await findOrCreateByUser(user);
        if (profile.uid !== user?.uid && !req.admin)
            return res.sendStatus(403);

        if (body.displayName)
            profile.displayName = body.displayName;
        if (body.profilePicURL)
            profile.profilePicURL = await copyProfilePic(body.profilePicURL);
        if (body.profilePicAsc)
            profile.profilePicURL = await copyProfilePic(Buffer.from(body.profilePicAsc, "base64"));
        await profile.save();
    }
    catch (error) {
        next(error);
    }
};

router.post("/:id?", authenticate(true), setProfile, profileResponse);

export default router;
