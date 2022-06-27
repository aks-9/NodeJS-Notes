//* Creating Users from Model

//? Create a new file 'authController.js' in the 'controllers' folder. All the functions related to authentication will be here.

// This is 'authController.js' file.

const User = require("./../models/userModel"); //importing
const catchAsync = require("./../utils/catchAsync"); //importing

// For signing up
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// Go to 'userRoutes.js' file and create a new route.
