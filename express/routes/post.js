import {Router} from "express";
import bodyParser from "body-parser";
import {addHours} from "date-fns";
import {getProfile} from "../lib/profile.js";
import PostBlob from "../models/PostBlob.js";
import {getEmptyFile} from "../lib/googlecloud.js";
import {cloudStorageBucket} from "../lib/config.js";

const router = Router();

router.use(bodyParser.json());

router.post("/", getProfile(true), async (req, res, next) => {
    try {
        // only allow one concurrent upload
        let blob = await PostBlob.findOne({profile: req.profile});
        if (blob)
            return res.sendStatus(409);

        const file = await getEmptyFile(cloudStorageBucket.postBlobs);
        const [signedURL] = await file.getSignedUrl({
            action: "write",
            expires: addHours(new Date(), 1),
            version: "v4"
        });
        blob = await PostBlob.create({
            profile: req.profile,
            file: file.name,
            signedURL
        });

        res.json({
            blob: blob.id,
            signedURL
        });
    }
    catch (error) {
        next(error);
    }
});

router.post("/:id", getProfile(), async (req, res, next) => {
    res.json(req.body);
});

export default router;
