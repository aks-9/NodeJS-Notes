//* Creating our own Middleware-5

//* global middleware and manipulating the request object

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

//Global middleware: A custom middleware defined in the top-level code, which gets executed for all of the requests.

//global middleware-1
app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");

  next();
});

//Another global middleware
//global middleware-2
app.use((req, res, next) => {
  //Here we want to manipulate the request obj, and add the current time to the request.
  req.requestTime = new Date().toISOString(); //So we can simply define a property on the request object called 'requestTime'. And then set it to a new Date function, which translates to date and time at the moment. And then we can use a function 'toISOstring', which will then convert it into a readable string for us.

  next();
}); //If we have some route handler that really needs the information about when exactly the request happens. And so the very simple solution is to simply add something like this to a request using middleware.

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime); //we can now use some route handler here, for 'getting all the tours' to simply log that for us to the console.
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime, //sending 'requestTime' in the response as well.
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

app.route("/api/v1/tours").get(getAllTours).post(createTour); //Route handler-1

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
Go to the Postman app, and send the 'Get All Tour' request.

It will print the following in the terminal's console:

App running on 3000...
Hello from the middleware 👋  //string from the global middleware-1 
2022-05-12T09:09:48.812Z  ///timestamp from the global middleware-2

==> In the postman app as well, the output will show the timestamp , as we had added 'requestedAt' property to the request object:
{
    "status": "success",
    "requestedAt": "2022-05-12T09:09:57.345Z",
*/
