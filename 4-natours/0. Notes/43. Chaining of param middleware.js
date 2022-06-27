//* Chaining of param middleware

//This is 'tourController.js' file

/* Till now whenever we wanted to define a middleware, we only passed one middleware function. So for example in'tourRoutes.js' file, for handling this post request:

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour); //we only passed in this middleware function which is our 'createTour' handler. So that's the only function that is gonna be called whenever we get a post request. 

But lets now say that we want to actually run multiple middleware functions whenever we get a post request. for example, if we want to run a middleware before 'createTour' here to actually check the data that is coming in the body.

We will then first define it in this 'tourController.js' file, and then chain it in out 'tourRoutes.js' file like this:

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); //chaining of 'tourController.checkBody' param middleware

*/

const fs = require("fs");
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//adding a new param middleware to check if the body of the request has a name or price. we might want to check if 'request.body' actually contains the data that we want for the tour.
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
}; //This can now be chained with other param middleware in 'tourRoutes.js' file like this: .post(tourController.checkBody, tourController.createTour);

exports.checkId = (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: "<Updated tour here...>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

/* 
Go to the Postman app, select 'Create New Tour' and make sure that the body of the request doesn't have a 'price' property. 

{
    "name": "Test Tour 5",
    "duration": 10,
    "difficulty": "easy"
}

It should give you an error in the output:

{
    "status": "fail",
    "message": "Missing name or price"
}

But once we add the 'price' property in the body:

{
    "name": "Test Tour 5",
    "duration": 10,
    "difficulty": "easy",
    "price": 100
}

We would be able to create a new Tour:

{
    "status": "success",
    "data": {
        "tour": {
            "id": 12,
            "name": "Test Tour 5",
            "duration": 10,
            "difficulty": "easy",
            "price": 100
        }
    }
}

*/
