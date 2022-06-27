//* Updating User Routes

//?

// This is 'userRoutes.js' file.

const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController"); //importing

const router = express.Router();

router.post("/signup", authController.signup); // updating

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

/*
Go to Postman, select a POST method,

127.0.0.1:3000/api/v1/users/signup

{
    "name":"jonas",
    "email":"hello@jonas.io",
    "password":"pass1234",
    "passwordConfirm":"pass1234"
}

OUTPUT:

{
    "status": "success",
    "data": {
        "user": {
            "_id": "62b338abbebe843260a13eb9",
            "name": "jonas",
            "email": "hello@jonas.io",
            "password": "pass1234",
            "passwordConfirm": "pass1234",
            "__v": 0
        }
    }
}


*/
