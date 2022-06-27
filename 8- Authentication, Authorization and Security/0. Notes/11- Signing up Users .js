//* Signing up Users

//This is 'authController.js' file.

//? We will now sign a new user up, then sign the JWT, and then send that JWT to the client.

//* install npm i jsonwebtoken

const jwt = require("jsonwebtoken"); //importing
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body); //changed this as it was a flaw. It could allow anyone to change their role to admin.

  //* 'Better sign up code', only these defined fields can be used in the body of the request now.
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //Signing the token using the 'sign' method on 'jwt'. The first argument is the 'payload', which is an object of all data we want to store in this token. In this case, we only want the ID of the user. The second argument is the 'secret', which we are using from 'config.env' file. The third argument is options, which is again an object.
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token, //sending to the client.
    data: {
      user: newUser,
    },
  });
});

/*

127.0.0.1:3000/api/v1/users/signup

Input:

{
    "name":"new",
    "email":"hi@jonas.io",
    "password":"pass1234",
    "passwordConfirm":"pass1234"
}


OUTPUT:

{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjM1ODA5MDJjYzVmMjhjNDhhNjYzOSIsImlhdCI6MTY1NTkyMDY0OSwiZXhwIjoxNjYzNjk2NjQ5fQ.1pcRyiK2HxgjBNIQkhnWQgAMfJ3NNlDyPIH3ZS1BGoc",
    "data": {
        "user": {
            "role": "user",
            "_id": "62b3580902cc5f28c48a6639",
            "name": "new",
            "email": "hi@jonas.io",
            "password": "$2a$12$oSNfGqPCRz./hatx926DfOIlcZEvlsYvFRr.dVmm8cwYeeSV1Coji",
            "__v": 0
        }
    }
}

So we have got our token in the output after succesfull signup.
*/
