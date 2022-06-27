//* Data Sanitization

//This is 'app.js'

//? We will implement data sanitization which means cleaning all the data that comes into the application from any malicious code in the user input. We will do data sanitization against NoSQL Query Injection and Cross Site Scripting attacks.

// Install an npm packages:
// npm i express-mongo-sanitize
// npm i xss-clean

const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize"); //importing
const xss = require("xss-clean"); //importing

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

//* Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // This doesn't allow Mongo queries to run from the request.

//* Data sanitization against XSS. Removes malicious HTML code from the user input. It converts the HTML symbols into harmless text.
app.use(xss());

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

Simulating the NoSQL query injection attack.

Go to Login and input:

{
    "email": { "$gt": "" },
    "password":"pass1234"
}

Then this will allow to login as admin, without even knowing the email of the admin.

UPDATE: This flaw is fixed in MongoDB now.

*/
