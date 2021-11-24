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
        const file = await getEmptyFile(cloudStorageBucket.postBlobs);
        const [signedURL] = await file.getSignedUrl({
            action: "write",
            expires: addHours(new Date(), 1),
            version: "v4"
        });
        const blob = await PostBlob.create({
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
