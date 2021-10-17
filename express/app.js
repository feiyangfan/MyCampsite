const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require("./routes/index");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.append("X-Backend-Env", process.env.NODE_ENV === "production" ? "prod" : "dev");
    next();
})
app.use("/", indexRouter);

module.exports = app;