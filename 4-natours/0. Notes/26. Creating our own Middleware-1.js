//* Creating our own Middleware

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json()); //The 'use' method is the one that we use to add a 'middleware' to our 'middleware stack'. This 'express.json()' basically returns a function. And so that function is then added to the 'middleware stack'. And so, similar to that, we can create our own middleware function.

//defining a custom middleware
app.use((req, res, next) => {
  //Express basically passes the 'next' function as the third argument into this middleware function. And we can then call it whatever we want. But 'next' is really the convention.
  console.log("Hello from the middleware 👋");

  next(); //if we didn't call 'next' here, then the 'request/response cycle' would be stuck at this point. We wouldn't be able to move on, and we would never ever send back a response to the client. So it is very important to never forget to use 'next' in all of your middleware.
});

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
};

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

app.route("/api/v1/tours").get(getAllTours).post(createTour);

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

It will print the following in the terminal's console:

Hello from the middleware 👋
*/
