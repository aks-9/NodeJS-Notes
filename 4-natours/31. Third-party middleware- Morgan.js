//*Using a third-party middleware function called 'Morgan' from npm

//* Morgan is a very popular logging middleware, that's gonna allow us to see request data right in the console.

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const morgan = require("morgan"); //a third-party middleware
const app = express();

//* 1) MIDDLEWARES

app.use(morgan("dev")); // we can use some predefined strings to  pass an argument which will kind of specify how we want the logging to look like. Here we're using 'dev'. Other strings are 'tiny', 'short' etc.
//Calling this morgan function will return a function similar to the callback function of the 'global middleware-1' and because this is how a middleware function has to look like.

app.use(express.json());

//global middleware-1
app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");

  next();
});

//global middleware-2
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//* 2) ROUTE HANDLERS or Controllers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
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

//* 3) ROUTES
app.route("/api/v1/tours").get(getAllTours).post(createTour); //Route-1

// Route-2
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//* START SERVER

const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
Go to the Postman app, and send the 'Get All Tour' request.

It will print the following in the terminal's console:

App running on 3000...
Hello from the middleware 👋
2022-05-13T15:27:14.237Z
GET /api/v1/tours 200 3.745 ms - 8746

==>  we get the HTTP method, we get the URL, we get the status code, the time it took to send back the response and also the size of the response in bytes.

If we make an invalid request it will also log the status code: 404

App running on 3000...
Hello from the middleware 👋
{ id: '3234' }
GET /api/v1/tours/3234 404 5.494 ms - 40

*/
