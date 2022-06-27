//* Handling unhandled routes

//This is 'app.js' file

const express = require("express");
const morgan = require("morgan");

const app = express();

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//* 1. MIDDLEWARES:

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//!No longer needed
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* 2. ROUTES:
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//handling unhandled routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can find the  ${req.originalUrl} on this server!`,
  });
});

module.exports = app;

/*

127.0.0.1:3000/api/v1/toursssssssssssssssss



{
    "status": "fail",
    "message": "Can find the  /api/v1/toursssssssssssssssss on this server!"
}
*/
