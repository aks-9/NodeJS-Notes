//* Updating the current user data -1

// This is 'userController.js'

//? Allowing the currently logged in user to manipulate its user data.

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError"); // importing

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

//* Allowing the currently logged in user to manipulate its user data.
exports.updateMe = catchAsync(async (req, res, next) => {
  //* 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated

  /* Go to 'userRoutes.js' file and add:
  
   router.patch('/updateMe', authController.protect, userController.updateMe);

  */

  // 3) Update user document

  //sending response
  res.status(200).json({
    status: "success",
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

//For admins
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

/*

In Postman, {{URL}}api/v1/users/updateMe and use 'Patch' method.

save as Update Current User Data

Go to Authorization tab, select "Bearer Token"


Go to Sign Up and create a new user: 
{
    "name": "J",
    "email": "test@jonas.io",
    "password": "pass1234",
    "passwordConfirm": "pass1234"
}

This will give an error message: "message": "This route is not for password updates. Please use /updateMyPassword.",


==> So user can't update password from this route.


*/
