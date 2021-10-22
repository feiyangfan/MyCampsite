import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

// mongoose and mongo connection
const { mongoose } = require("./database/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues

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

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
  // check mongoose connection established.
  if (mongoose.connection.readyState != 1) {
    log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  } else {
    next();
  }
};

// checks for first error returned by promise rejection if Mongo database suddenly disconnects
const isMongoError = (error) => {
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
}

export default app;
