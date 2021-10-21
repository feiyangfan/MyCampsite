import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";

// ES6 code needed for __dirname to work below
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import locationRouter from "./routes/location.js";
import indexRouter from "./routes/index.js";
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

// FOR TESTING
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.wzta6.mongodb.net/Testing?retryWrites=true&w=majority"
);

export default app;
