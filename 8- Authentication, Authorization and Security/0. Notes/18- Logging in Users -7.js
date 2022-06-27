//* Logging in the registered users- 7

// this is 'authController.js' file

//? Creating a seperate function to sign the token.

const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//* Separate function to sign the token, this will have 'id' as the only argument.
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    //Using ES6 syntax for 'id' instead of { id: newUser._id }
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id); //* calling 'signToken' function and passing 'id' as the argument.

  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

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
  const user = await User.findOne({ email }).select("+password");
  //console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id); //* calling 'signToken' function and passing 'id' as the argument.
  res.status(200).json({
    status: "success",
    token,
  });
});

/*
127.0.0.1:3000/api/v1/users/login

{
    "email":"hi@jonas.io",
    "password":"pass1234"
}

Output:

{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjM1ODA5MDJjYzVmMjhjNDhhNjYzOSIsImlhdCI6MTY1NTkyOTY1MywiZXhwIjoxNjYzNzA1NjUzfQ.WLna80PEknjvQORpNhxIOpf2ayCreTTtgurc9WRjasQ"
}

==> So we have succesfully logged in a registered user.

*/
