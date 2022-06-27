//* Better Errors and Refactoring- 5

//This is 'app.js' file

const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController"); //importing
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
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//! Refactoring
app.use(globalErrorHandler); //sending to global error handler module.

module.exports = app;

/*


*/
