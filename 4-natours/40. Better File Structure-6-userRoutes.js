//* A better file structure-4

//This is 'userRoutes.js' file.

const express = require("express"); //importing
const userController = require("./../controllers/userController"); //importing.

const router = express.Router(); //it's kind of a convention to simply call this 'router', and not 'userRouter'.

router //renamed as router
  .route("/") //
  .get(userController.getAllUsers) // accessing 'getAllTours' through 'tourController'
  .post(userController.createUser);

router //renamed as router
  .route("/:id") //
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router; //exporting
