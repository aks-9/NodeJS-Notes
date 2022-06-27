//* Logging in the registered users- 2

//? We will now check if there is actually a user for the email that was posted in the request.

// this is 'authController.js' file.

const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }); //Using 'findOne' as we need to find the user based on email and not on ID. Using ES6 syntax '{ email }' instead of '{email: email}' as a filter object.
  console.log(user);

  /*
  Now as of now, the password is visible in the output of Postman as encrypted data, which is not a good practice. To fix this, go to userModel.js file and in the password property, add a 'select' field, and set it to 'false'.

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  }

  */

  // 3) If everything ok, send token to client

  const token = "";
  res.status(200).json({
    status: "success",
    token,
  });
});

//now password will not be included in output
