import {Router} from "express";
import {ObjectId} from "mongodb";
import bodyParser from "body-parser";
import {addHours} from "date-fns";
import {getProfile} from "../lib/profile.js";
import Post from "../models/Post.js";
import Park from "../models/Park.js";
import {getEmptyFile} from "../lib/googlecloud.js";
import {cloudStorageBucket} from "../lib/config.js";
import Site from "../models/Site.js";

const router = Router();

router.use(bodyParser.json());

// show all posts
router.get("/:siteId?", async (req, res, next) => {
    if (!ObjectId.isValid(req.params.siteId)) {
        res.json([]);
        return;
    }
    const posts = await Post.find({finishDate: {$ne: null}});
    const filteredPosts = await Promise.all(posts.filter(async (post) => {
        const siteId = req.params.siteId ? req.params.siteId : post.siteId;
        const park = await Park.findOne({"sites._id": siteId});
        return park;
    }).map(async (post) => {
        const siteId = req.params.siteId ? req.params.siteId : post.siteId;
        const park = await Park.findOne({"sites._id": siteId});
        if (park) {
            const site = park.sites.find(site => site._id.toString() == siteId.toString());
            const newpost = {
                _id: post._id,
                siteId: post.siteId,
                siteName: site.name,
                notes: post.notes,
                weatherTemp: post.weatherTemp,
                weatherDesc: post.weatherDesc,
                profile: post.profile,
                file: post.file,
                signedURL: post.signedURL,
                publicURL: post.publicURL,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            };
            return newpost;

        }
        return {};
    }));
    res.json(filteredPosts);
});

// Sample Payload
// {
//     "siteId": "61a049a0dedb185a1ab51e48",
//     "notes": "This is my campsite!",
//     "weatherTemp": 10,
//     "weatherDesc": "Clear"
// }
router.post("/", getProfile(true), async (req, res, next) => {
    const {siteId, notes, weatherTemp, weatherDesc} = req.body;
    const weatherDescriptions = ['Clear', 'Cloudy', 'Rainy', 'Snowy', 'Atmosphere'];
    if (typeof notes !== "string" || typeof weatherTemp !== "number" || !weatherDescriptions.includes(weatherDesc)) {
        return res.sendStatus(400);
    }
    try {
        // TODO prevent post and storage file spam

        const file = await getEmptyFile(cloudStorageBucket.postBlobs);
        const site = await Site.findById(siteId);
        const post = await Post.create({
            siteId: site,
            notes: notes,
            weatherTemp: weatherTemp,
            weatherDesc: weatherDesc,
            profile: req.profile,
            file: file.name
        });

        const [signedURL] = await file.getSignedUrl({
            action: "write",
            expires: addHours(new Date(), 1),
            version: "v4"
        });
        res.json({
            id: post.id,
            signedURL
        });
    }
    catch (error) {
        next(error);
    }
});

router.post("/:id", getProfile(true), async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate("profile");
        if (req.profile.id !== post.profile.id) // TODO allow admin
            return res.sendStatus(403);

        if (req.body.finish) {
            post.finishDate = new Date();
        }

        // TODO other edits

        await post.save();
        return res.json(post);
    }
    catch (error) {
        next(error);
    }
});

export default router;
