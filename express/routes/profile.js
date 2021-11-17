import {Router} from "express";
import bodyParser from "body-parser";
import {authenticate} from "../lib/googlecloud.js";
import {getProfile, setProfile} from "../controllers/profile.js";

const router = Router();
router.use(bodyParser.json());
router.get("/:id?", [authenticate()], getProfile);
router.post("/:id?", [authenticate(true), setProfile]);
export default router;
