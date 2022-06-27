//* Updating password

//This is 'authoController.js'

//? Allowing a logged-in user to update his password, and creating a separate function for creating a token to send.

const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//* Separate token function.
// The first argument is 'user' as that's where the 'id' is stored. The second argument is 'statusCode', the third argument is a 'response' object.
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    //sending 'statusCode'
    status: "success",
    token,
    data: {
      user, //sending 'user'.
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res); //adding

  //! Moved to 'createSendToken' above.
  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res); //adding

  //! Moved to 'createSendToken' above.
  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user: user,
  //   },
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res); //adding

  //! Moved to 'createSendToken' above.
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

//* Allowing a logged-in user to update his password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password"); //explicitly passing password, as it is not available in output by default.

  // 2) Check if POSTed current password is correct, using an instance method 'correctPassword'
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    // passing the password input by user for security validation, and comparing with user's password in the database.
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password; //updating the password
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); //saving the document
  // User.findByIdAndUpdate will NOT work as intended! As the validator in the 'passwordConfirm' property in the schema only works for 'create' and 'save'. So we don't use these 'update' methods with anything related to passwords.

  // 4) Log user in, send JWT
  createSendToken(user, 200, res); // utilizing 'createSendToken' function to send a response.
});

/*
Now go to userRoutes.js file and add:

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);


-------------------------------------------------------

Make sure you are logged in as 'admin' in Postman.


Now go to {{URL}}api/v1/users/updateMyPassword and select 'Patch' method.

Save it as 'Update Current User Password', goto the body and input:

{
    "passwordCurrent": "pass1234",
    "password": "newpassword",
    "passwordConfirm": "newpassword"
}

Go to Authorization tab, select 'Bearer Token'. Notice the encrypted password in the database, so as to compare it with when we update the password.


OUTPUT:
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjg3ZGM0ZmUxYWY4MzlhNGI0NjEyYiIsImlhdCI6MTY1NjI1ODMyMSwiZXhwIjoxNjY0MDM0MzIxfQ.7ZM74Nlsczkr1FVEy7z8ACj-ToJcUNMBPSuBEQbnNIw",
    "data": {
        "user": {
            "role": "admin",
            "_id": "62b87dc4fe1af839a4b4612b",
            "name": "admin",
            "email": "admin@jonas.io",
            "__v": 0,
            "passwordChangedAt": "2022-06-26T15:45:20.442Z"
        }
    }
}



==> Now the encrypted password must have changed in the database, along with the 'passwordChangedAt' timestamp.

Add this to the 'Tests' tab 

pm.environment.set("jwt", pm.response.json().token);

*/
