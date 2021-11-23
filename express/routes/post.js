import {Router} from "express";
import bodyParser from "body-parser";
import {authenticate} from "../lib/googlecloud.js";

const router = Router();

router.use(bodyParser.json());

router.post("/", authenticate(true), (req, res) => {
    res.json(req.body);
});

export default router;
