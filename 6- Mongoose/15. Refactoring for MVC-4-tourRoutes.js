//* Refactoring for MVC-4

//This is 'tourRoutes.js' file

const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

// router.param('id', tourController.checkId); As 'checkId' no longer exists in 'tourController.js' file.

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour); //removed 'tourController.checkBody'

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
