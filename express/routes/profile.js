import {Router} from "express";
import {authenticate} from "../controllers/googlecloud.js";
import {getProfile, setProfile} from "../controllers/profile.js";
import bodyParser from "body-parser";

const router = Router();
router.use(bodyParser.json());
router.get("/:id?", [authenticate()], getProfile);
router.post("/:id?", [authenticate(true), setProfile]);
export default router;
