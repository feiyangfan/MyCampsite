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
};

export default mongoChecker;
export default isMongoError;