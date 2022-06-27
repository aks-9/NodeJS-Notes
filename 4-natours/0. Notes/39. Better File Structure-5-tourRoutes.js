//* A better file structure-3

//This is 'tourRoutes.js' file. It has all the routes for 'tours' resource.

//So we have our routers now each in one different file, and we can say that each of them is one small sub-application. So one tour application and one user application.

const express = require("express"); //importing
const tourController = require("./../controllers/tourController"); //importing, to get access to the 'route handlers functions'.

//We could also use destructuring, we don't have to write 'tourController' every time we access a controller.
// const {
//   getAllTours,
//   createTour,
//   getTour,
//   updateTour,
//   deleteTour,
// } = require('./../controllers/tourController');

const router = express.Router(); //it's kind of a convention to simply call this 'router', and not 'tourRouter'.

//* When we import everything into one object, then all of the data that was on 'exports' is now gonna be on 'tourController'. So we can access all our controllers through 'tourController'.
router //renamed as router
  .route("/") //
  .get(tourController.getAllTours) // accessing 'getAllTours' through 'tourController'
  .post(tourController.createTour);

router //renamed as router
  .route("/:id") //
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router; //exporting
