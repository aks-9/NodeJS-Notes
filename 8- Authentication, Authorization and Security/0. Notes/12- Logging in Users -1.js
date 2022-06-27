//* Logging in the registered users - 1

//? We will now log in the registered users based on email and password. The token will only be issued if the user exists and the credentials are correct.

// this is 'authController.js' file.

const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError"); //importing

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

//* LOGGING IN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    //If the email or password is wrong, send an error.
    return next(new AppError("Please provide email and password!", 400)); //make sure to add 'return' before the next() so the this login function finishes off here in case of an error.
  }
  // 2) Check if user exists && password is correct

  // 3) If everything ok, send token to client

  //creating a temporary fake token
  const token = "";
  res.status(200).json({
    status: "success",
    token,
  });
});

// add in userRoutes.js
//router.post('/login', authController.login);

/*
Use POST method in Postman

127.0.0.1:3000/api/v1/users/login

INPUT:
{
    "email":"hi@jonas.io",
    "password":"pass1234"
}


OUTPUT:

{
    "status": "success",
    "token": ""
}

*/
