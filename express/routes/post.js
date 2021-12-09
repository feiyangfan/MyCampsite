import { Router } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { addHours } from "date-fns";
import { getProfile } from "../lib/profile.js";
import Post from "../models/Post.js";
import Park from "../models/Park.js";
import { getEmptyFile } from "../lib/googlecloud.js";
import { cloudStorageBucket } from "../lib/config.js";
import { fetchWeather } from "../lib/weather.js";

const router = Router();

router.use(bodyParser.json());

const postResponseBody = (post) => ({
  id: post._id,
  siteId: post.siteId,
  notes: post.notes,
  weatherTemp: post.weatherTemp,
  weatherDesc: post.weatherDesc,
  profile: post.profile instanceof mongoose.Model ? post.profile.id : post.profile,
  publicURL: cloudStorageBucket.postBlobs.file(post.file).publicUrl(),
  thumbnailPublicURL: post.thumbnailFile ? cloudStorageBucket.postBlobs.file(post.thumbnailFile).publicUrl() : null,
  createdAt: post.createdAt,
});

router.delete("/:id", getProfile(true), async (req, res) => {
  console.log("trying to delete", req.params.id);
  try {
    const post = await Post.findById(req.params.id).populate("profile");
    if (req.profile.id !== post.profile.id && !req.admin)
      return res.sendStatus(403);
    const deletedPost = await Post.deleteOne({ _id: req.params.id });
    console.log(deletedPost);
    res.send(deletedPost);
  } catch (error) {
    console.log(error);
  }
});

// show all posts
router.get("/:siteId?", async (req, res, next) => {
  if (!ObjectId.isValid(req.params.siteId)) {
    res.json([]);
    return;
  }
  const siteId = req.params.siteId ? req.params.siteId : post.siteId;
  const posts = await Post.find({ finishDate: { $ne: null }, siteId: siteId });
  const filteredPosts = posts.map((post) => postResponseBody(post));
  res.json(filteredPosts);
  // const filteredPosts = await Promise.all(posts.filter(async (post) => {
  //     const siteId = req.params.siteId ? req.params.siteId : post.siteId;
  //     const park = await Park.findOne({"sites._id": siteId});
  //     return park;
  // }).map(async (post) => {
  //     const siteId = req.params.siteId ? req.params.siteId : post.siteId;
  //     const park = await Park.findOne({"sites._id": siteId});
  //     if (park) {
  //         const site = park.sites.find(site => site._id.toString() == siteId.toString());
  //         return postResponseBody(post);
  //     }
  //     return {};
  // }));
});

router.post("/", getProfile(true), async (req, res, next) => {
  const { siteId, notes } = req.body;
  try {
    // TODO prevent post and storage file spam

    // find site
    const park = await Park.findOne({ "sites._id": siteId });
    const site = park.sites.find((site) => site._id == siteId);
    if (!site) return res.sendStatus(404);

    // obtain weather
    const weather = await fetchWeather(site);
    let weatherTemp = "";
    let weatherDesc = "";
    if (weather && weather.main && weather.weather && weather.weather.length > 0) {
      weatherTemp = weather.main.temp;
      weatherDesc = weather.weather[0].main;
    }

    const file = await getEmptyFile(cloudStorageBucket.postBlobs);
    const thumbnailFile = await getEmptyFile(cloudStorageBucket.postBlobs);
    const post = await Post.create({
      siteId: site,
      notes: `${notes}`,
      weatherTemp: weatherTemp,
      weatherDesc: weatherDesc,
      profile: req.profile,
      file: file.name,
      thumbnailFile: thumbnailFile.name,
    });

    const [signedURL] = await file.getSignedUrl({
      action: "write",
      expires: addHours(new Date(), 1),
      version: "v4",
    });
    const [thumbnailSignedURL] = await thumbnailFile.getSignedUrl({
      action: "write",
      expires: addHours(new Date(), 1),
      version: "v4",
    });
    res.json({
      id: post.id,
      signedURL,
      thumbnailSignedURL,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id", getProfile(true), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("profile");
    if (req.profile.id !== post.profile.id && !req.admin)
      return res.sendStatus(403);

    const { finish, notes } = req.body;
    if (finish) {
      post.finishDate = new Date();
    }
    if (notes) post.notes = notes;
    await post.save();
    return res.json(postResponseBody(post));
  } catch (error) {
    next(error);
  }
});

export default router;
