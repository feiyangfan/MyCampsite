import express from "express";
// const path = require("path");
// const cookieParser = require("cookie-parser");
// const logger = require("morgan");
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import locationRouter from "./routes/locations.js";
import indexRouter from "./routes/index.js";
// const cors = require("cors");
import cors from "cors";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.append(
    "X-Backend-Env",
    process.env.NODE_ENV === "production" ? "prod" : "dev"
  );
  next();
});
app.use("/", indexRouter);
app.use("/locations", locationRouter);

export default app;
