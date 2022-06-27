//* Aliasing -1

//This is 'tourRoutes.js' file

//? Provide an alias route to a request that might be very popular, so it might be requested all the time.

/* 
we might want to provide a route specifically for the five best cheap tours. So, the request would look a little bit like this.

127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price

So in Postman, we would get 5 results, with descending order of ratings and if the rating is same then the ones with less price will come earlier in order.

*/

//Now, let's say that this is a request that is done all the time and we want to provide a route that is simple and easy to memorize for the user.

// So in this 'tourRoutes.js' file, we will create a new route.

const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours); //we want to prefill some of the fields in the query string before we call 'getAllTours', so we will use a middleware 'aliasTopTours' before it. An this middleware function is then gonna manipulate the query object that's coming in, and then pass it to the 'getAllTours'.

// Now go to the 'tourController.js' file and create a new middleware 'aliasTopTours' there.

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
