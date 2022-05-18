//* Creating our own Middleware-3

//* The importance of 'order'.

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
}; //So here is the 'getAllTours' function and by sending a result with 'res.status.json()', we actually end the request response cycle.

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tours: "<Updated tour here...>",
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

app.route("/api/v1/tours").get(getAllTours).post(createTour); //Route handler-1

//Moving our custom middleware after a route handler-1. Now we won't have 'Hello from the middleware 👋'. Simply because the route handler-1 comes before in order than our custom middleware function. And the route handler, which in this case, is for 'Get All Tours' request , actually ends the request response cycle. So this will call 'getAllTours' function which will end the request-response cycle.
app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");

  next();
}); //And so the next middleware in the stack, which in this case, is  our custom one will then not be called, because the cycle has already finished. So the 'order' really matters a lot in express.

//route handler -2
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
Go to the Postman app, and send the 'Get All Tours' request.

It will not print the 'Hello from the middleware 👋', but print the following in the terminal's console:

[nodemon] restarting due to changes...
[nodemon] starting `node app.js`
App running on 3000...
*/
