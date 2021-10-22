// middleware for mongo connection error for routes that need it
module.exports = function mongoChecker(req, res, next) {
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
module.exports = function isMongoError(error) {
    return (
      typeof error === "object" &&
      error !== null &&
      error.name === "MongoNetworkError"
    );
};