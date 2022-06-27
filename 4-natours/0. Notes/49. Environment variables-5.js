//* Environment variables-5

// This is 'app.js' file.

//? using 'NODE_ENV' variable and also the port variable.

const express = require("express");
const morgan = require("morgan");
const app = express();

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1. MIDDLEWARES

//We have logger middleware(morgan) here and we want to only run that middleware so to only define it when we are actually in development, so that the logging does not happen when the app is in production.
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

// Why we actually have access to this environment variable here when we didn't really define them in this file but in 'server.js'?

//That is because the reading of the variables from the file which happens here to the node process only needs to happen once. It's then in the process, and the process is of course the same no matter in what file we are. So we're always in the same process and the environment variables are on the process. So this is available to us in every single file in the project.

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
