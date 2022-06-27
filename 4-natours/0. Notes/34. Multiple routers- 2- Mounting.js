//* Multiple routers- 2

//? Mounting the routers to the seperate routes

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const app = express();

//* 1) MIDDLEWARES

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");
  next();
});

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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet implemented",
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet implemented",
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet implemented",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet implemented",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet implemented",
  });
};

//* 3) ROUTES

const tourRouter = express.Router();
const userRouter = express.Router(); //Router for Users

tourRouter
  .route("/") //
  .get(getAllTours)
  .post(createTour);

tourRouter //
  .route("/:id") //
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter //updating the sub routes for Users
  .route("/") //
  .get(getAllUsers)
  .post(createUser);

userRouter //
  .route("/:id") //
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter); //Mounting a new router(userRouter), on the route('/api/v1/users'). These have to come after all of the definitions. So we cannot use the routers before we actually declare them.

//* START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
Go to the Postman app, send 'Get All Tours' request:

It will print the following in the output:

App running on 3000...
Hello from the middleware 👋
2022-05-13T16:58:13.138Z
GET /api/v1/tours 200 5.263 ms - 8746


And then 'Get All Users' request. It will print the following in the output:

App running on 3000...
Hello from the middleware 👋
GET /api/v1/users 500 3.990 ms - 64

==> Now we are ready to actually separate or different routers now into different files. And that we will do right in the next lecture.


*/
