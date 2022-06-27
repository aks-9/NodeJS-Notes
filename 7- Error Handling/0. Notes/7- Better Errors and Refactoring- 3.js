//* Better Errors and Refactoring- 3

//This is 'app.js' file

//create a new file 'errorController.js' in the controllers folder

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
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //'req.originalUrl' is a property on req. Calling the error class with 'new AppError'
});

//! Moving this to 'errorController.js' in the controllers folder
app
  .use //(err, req, res, next) => {
  //   err.statusCode = err.statusCode || 500;
  //   err.status = err.status || 'error';

  //   res.status(err.statusCode).json({
  //     status: err.status,
  //     message: err.message
  //   });
  // }
  ();

module.exports = app;

/*


*/
