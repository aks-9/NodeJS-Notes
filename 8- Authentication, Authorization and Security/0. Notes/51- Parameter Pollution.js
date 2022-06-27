//* Parameter Pollution

//This is 'app.js'

//? When we pass more than required parameters in the url of a request, then it causes error. We will use HPP middleware to fix that. HPP stands for HTTP Parameter Pollution.

/*
Go to Postman, Get All Tours and pass this url:

{{URL}}api/v1/tours?sort=duration&sort=price


This will give us an error:
"message": "this.queryString.sort.split is not a function",

As sort is defined twice, it is no longer acting as a string, and it can't be split using the 'split' method, which we have implemeted in 'sort()' in 'APIFeatures.js' file. Express will make an array out of it like this: [ 'duration', 'price' ], and we can't split an array.

We need to remove these duplicate fields from the URL, using a middleware.

*/

// Install an npm packages:
// npm i hpp

const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp"); //importing

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//* Using HPP. It should be used by the end, as it clears up the query string. After using this, only the last filter will be used in the url.

//* But sometimes we want duplicates, like {{URL}}api/v1/tours?duration=5&duration=9, so in such cases we will use a 'whitelist'. So we will pass an object in the hpp(), called 'whitelist', which is simply an array of properties for which we actually allows duplicates in the query string.
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

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
