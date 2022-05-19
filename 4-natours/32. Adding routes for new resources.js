//* Adding routes for new resources

//* implement some routes for the users' resource

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const app = express();

//* 1) MIDDLEWARES

app.use(morgan("dev"));
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

//* 2) ROUTE HANDLERS
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

//adding new route handlers for new resource 'users'
const getAllUsers = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

//* 3) ROUTES

// Route-1
app.route("/api/v1/tours").get(getAllTours).post(createTour);

// Route-2
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//adding routes for new resource
app.route("/api/v1/users").get(getAllUsers).post(createUser);

//adding routes for new resource
app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

//* START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
Go to the Postman app, paste 127.0.0.1:3000/api/v1/users in the address and save as the 'Get All Users' request. click send.

It will print the following in the outoput:
{
    "status": "error",
    "message": "This route is not yet implemented"
}

*/
