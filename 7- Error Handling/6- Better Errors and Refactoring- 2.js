//* Better Errors and Refactoring- 2

//This is 'app.js' file

const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError"); //importing
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//* 1. MIDDLEWARES:

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* 2. ROUTES:
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//handling unhandled routes
app.all("*", (req, res, next) => {
  //TODO: remove this creating an eror
  // const err = new Error(`Can't find the  ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //'req.originalUrl' is a property on req. Calling the error class with 'new AppError'
});

// Adding Global Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;

/*


*/
