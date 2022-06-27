//* Logging in the registered users- 3

//? Removing the encrypted password from the Postman output while creating a new user, as Postman is reading from the database at that time. Implementing the route

//Go to 'userController.js' file as getting all users has nothing to do with the authentication.

// This is 'userController.js' file

const User = require("./../models/userModel"); //Importing
const catchAsync = require("./../utils/catchAsync"); //Importing

//Impelmenting this to not reveal encrypted password while reading users from database.
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  //* SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    //status code '500' means internal server error.
    status: "error",
    message: "This route is not yet implemented",
  });
};

/*
Now if we try to Get All Users

127.0.0.1:3000/api/v1/users

It will not show the encrypted password of any user.

Now go to 'authController.js' file

*/
