import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from 'mongoose';
import {mongoChecker, isMongoError} from "./database/middleware.js";
import "./lib/config.js";

// ES6 code needed for __dirname to work below
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import locationRouter from "./routes/location.js";
import indexRouter from "./routes/index.js";
import profileRouter from "./routes/profile.js";
import postRouter from "./routes/post.js";
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
app.use("/location", locationRouter);
app.use("/profile", profileRouter);
app.use("/post", postRouter);

/* Connect to our database */
// Get the URI of the local database, or the one specified on deployment.
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/301project'
mongoose.connect(mongoURI);

export default app;