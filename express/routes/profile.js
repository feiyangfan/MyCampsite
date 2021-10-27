import {Router} from "express";
import {authenticate} from "../controllers/googlecloud.js";
import {getProfile} from "../controllers/profile.js";

const router = Router();
router.use(authenticate);
router.get("/:id?", getProfile);
export default router;
