//* Param middleware -2

//This is 'tourRoutes.js' file

//* Use case of param middleware.
//In our 'tourController' we check if 'id' is valid or not in the 'getTour', 'deleteTour', and 'updateTour' handler functions. So all these three functions have this very similar code which is repeated. It is not a good practice to repeat code and so what we can do here is to use the concept of 'param middleware', and perform this check in an outside middleware that it's gonna run before the request even hits these handler functions.

const fs = require("fs");
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//creating a new param middleware 'checkId', and exporting it.
exports.checkId = (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`); //checking if 'checkId' is running.

  //* VALIDATING
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      //It's very important that we have this 'return' statement here, because if we didn't have this 'return' here, well, then express would send this response back but it would still continue running the code in this function. And so after sending the response, it will then still hit this 'next' function and it would move on to the next middleware and will then send another response to the client. But that is really not allowed, to send headers after the response had already been sent.
      status: "fail",
      message: "Invalid ID",
    });
  }
  next(); //calling the next function.
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

  //!Moved to param middleware 'checkId'.
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

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
  //!Moved to param middleware 'checkId'.
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: "success",
    data: {
      tours: "<Updated tour here...>",
    },
  });
};

exports.deleteTour = (req, res) => {
  //!Moved to param middleware 'checkId'.
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

/* Now go to the 'tourRoutes.js' file and edit this:

router.param('id', (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`);
  next();
});


to this:

router.param('id', tourController.checkId);


Now go to Postman app, run "Get Tour" with a id.

You should see the following in the terminal's console:
Hello from the middleware 👋
Tour ID is: 2
GET /api/v1/tours/2 500 9.282 ms - 1337



==> So this 'param middleware' is now part of our middleware stack.

Now you might argue that we might simply create a simple function which could also check for the ID and I call that function inside of each of these tour function, and then call it inside each of these relevant tour controllers; but that would really go against the philosophy of express, where we should always work with the middleware stack as we can.

These route handler functions do not have to worry at all about validation. Each of these functions has only one purpose which is to do what they say only.

*/
