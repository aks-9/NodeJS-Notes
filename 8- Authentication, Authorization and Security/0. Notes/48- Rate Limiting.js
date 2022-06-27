//* Rate Limiting

//This is 'app.js'

//? Rate limiting prevents an IP to make too many requests to our API, that helps us prevent attacks such a Denial of Service or Brute Force attacks. We will use global middleware for it.

// Install an npm package for rate limiting:
// npm i express-rate-limit

const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit"); //importing

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) GLOBAL MIDDLEWARES

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//* Limit requests from same API
// rate limiter counts requests from the same IP and blocks the requests after a limit is crossed. Using 'rateLimit' function, which has some options as arguments.
const limiter = rateLimit({
  max: 100, //max allowed requests in a time window.
  windowMs: 60 * 60 * 1000, //time window in milliseconds, setting to 1 hour here.
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter); //using our 'limiter' middleware on route '/api'.

// Body parser, reading data from body into req.body
app.use(express.json());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

/*
Now in Postman, go to Get All Tours,

Then in the Headers tab, you will see 'X-RateLimit-Limit' that shows the number of allowed requests, and 'X-RateLimit-Remaining' that shows the number of requests remaining. 

'X-RateLimit-Reset' shows the timestamp when the rate limit will be reset.

Our app should not be restarted or crash, otherwise the rate limit will also reset.

*/
