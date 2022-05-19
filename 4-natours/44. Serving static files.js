//* Serving static files.

//for example, we have this 'overview.html' file here in our 'public' folder. But right now there's no way that we can access this using a browser. To access that HTML file. So we can write '127.0.0.1:3000/public/overview.html'.

//But we will get an error: "Cannot GET /public/overview.html." This is because we can't access this right now because we didn't define any route for this URL. We do not have any handler that is associated to this route. And so, if we actually want to access something from our file system, we need to use a built-in Express middleware.

const express = require("express");
const morgan = require("morgan");
const app = express();

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//* 1. MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(`${__dirname}/public`)); //Middleware to use static files.

// Now if we go to '127.0.0.1:3000/overview.html', we will be able to access 'overview.html' file. We will not mention 'public' in the URL because when we open up a URL that node can't find in any of our routes, it will then look in that public folder that we defined. And it sets that folder to the root.

app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* 2. ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;

/*
We can also access the images in the 'img' folder like this:

http://127.0.0.1:3000/img/pin.png

But we can't do this http://127.0.0.1:3000/img/ , because this is not a file. This looks like a regular route, and so Express actually tries to find a route handler for this one, which it can't because we didn't define anything.


*/
