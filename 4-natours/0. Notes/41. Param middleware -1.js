//* Param middleware -1

//This is 'tourRoutes.js' file

//? It is a middleware that only runs for certain parameters, i.e. when we have a certain parameter in our URL.

//Now in our example here, the only parameter that we might have in our route URL is the 'id'. And so we can write middleware that only runs when this 'id' is present in the URL

const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

router.param("id", (req, res, next, val) => {
  //first is the parameter that we actually want to search for. Then the callback function, but here in a param middleware function, we actually get access to a fourth argument 'val' and that one is the value of the parameter in question.
  console.log(`Tour ID is: ${val}`);
  next();
});

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

/*
Go to Postman app, run "Get Tour" with a id.

You should see the following in the terminal's console:

Hello from the middleware 👋
Tour ID is: 3
{ id: '3' }
GET /api/v1/tours/3 200 7.151 ms - 953




If we don't use any id, and send "Get All Tours" request, then it will not be executed.

Terminal's console:

Hello from the middleware 👋
2022-05-17T14:23:12.960Z
GET /api/v1/tours 200 12.643 ms - 8746




==> Also this param middleware function is not going to run for any of the 'userRoutes'. 

Terminal's console:

Hello from the middleware 👋
GET /api/v1/users/2 500 7.354 ms - 64

==> because this middleware function is only specified in our 'tourRouter' only.

*/
