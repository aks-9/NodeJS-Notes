//* Authorization user roles and permissions -1

//This is 'tourRoutes.js' file

//? Sometimes, simply logging a user in, is really not enough. Here we 'authorize' only certain types of users, to perform certain actions. So we're gonna build another middleware function, this time to restrict certain routes, for example, deleting tours, only to certain user roles.

/*
So here in 'tourRoutes.js' file, add 'protect' and 'restrictTo' middleware before the 'delete' middleware is executed. The first middleware in the stack, will always be the 'protect' as we always need to check if a user is actually logged in. And In 'restrictTo' function we will then pass some user roles, who will be authorized to interact with a specific resource. In this case, with deleting a tour.

*/

const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"), // adding authorization middleware before 'deleteTour', and passing the 'roles' that are authorized to delete a user.
    tourController.deleteTour
  );

module.exports = router;

//Now go to the 'userModel.js' and add roles in schema.
