//* Multiple routers- 1

//? Our final goal will be to separate all the code that we have in the previous file into multiple files. So we will have one file that only contains all of these 'routes for tours', then another file, which has the 'routes for the users'. Then we will have a file which contains the 'handlers only for the users' and then also one file that will contain all the 'handlers for the tours'

//? But in order to be able to do that, we actually need to now create one separate router for each of our resources.

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

//create one router for each of the resources

const tourRouter = express.Router(); //creating a new router using a method called 'Router'.

app.use("/api/v1/tours", tourRouter); //using 'tourRouter' middleware, and we will use it for this specific route: '/api/v1/tours'. This URL here is already in our kind of parent route. When we create a router system like this, it's like a small sub app for each of these resources.

tourRouter
  .route("/") //'tourRouter' middleware, only runs on this '/api/v1/tours' route. And so once we are in the router, then we already are at this route. We use '/' to indicate '/api/v1/tours' only. So this is the root of or sub app.
  .get(getAllTours)
  .post(createTour);

tourRouter //We use '/:id' to indicate that we further have a sub route.
  .route("/:id") //We use '/' to indicate '/api/v1/tours' only.
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//So let's say that we have an incoming request now for '/api/v1/tours/'. So the request goes into the middleware stack and when it hits this line of code 'app.use('/api/v1/tours', tourRouter);', it will match this URL '/api/v1/tours'. So it will match this route and therefore our 'tourRouter' middleware function will run.

//So 'tourRouter' is this sub application that we created, which in turn has its own routes.

//And if the request was for '/api/v1/tours/:id' then it will inside our mini app, hit this route '/:id'

//And finally, it will run one of these handlers, depending on the method that was used.

app.route("/api/v1/users").get(getAllUsers).post(createUser);

app
  .route("/api/v1/tours/:id")
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
