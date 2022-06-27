//* Encrypting Passwords

//? After user signs up, but before the password is saved to the database, we will use a mongoose pre document middleware to encrypt it, and then save it to the database.

// This is 'userModel.js' file.

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs"); // install npm i bcryptjs . For encrypting the password.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
});

//* Using mongoose middleware; a pre document middleware.
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  //Here 'this' refers to the current document, i.e. the current user. We call the 'isModified' method that is available on the current document if a certain field has been modified, and here that field is 'password'.
  if (!this.isModified("password")) return next(); //Using '!' not operator, so this means if the password is not modified, then exit this middleware and go to next()

  // Encrypting or Hashing the password with cost of 12. 'bcrypt' will add 'salt' to our password, that is a random string, so that two same passwords do not generate the same hash. We can either manually generate the 'salt'  and add it here, or use a 'cost' parameter, that just means how CPU intensive this encryption will be. Default value of 'cost' parameter is 10.
  this.password = await bcrypt.hash(this.password, 12); //using the 'async' version of hash method on 'bcrypt'. That's why using 'await', and marking this whole middleware as 'async'

  // Delete passwordConfirm field
  this.passwordConfirm = undefined; //not persisting it in the database as we now only have encrypted password, and this is only used during signup. But as it is a 'required' input, we are making it 'undefined'.
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

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
            "role": "user",
            "_id": "62b341fbbd09441508036488",
            "name": "TEST",
            "email": "hi@jonas.io",
            "password": "$2a$12$IfQrtJBBtkQVPGMhw8TL1e.5RxduK/QXwdp6Qa//NXNab7yyHVd6.",
            "__v": 0
        }
    }


    
    
==> Notice that 'passwordConfirm' is not in the output after encryption. So once a user signs up, our pre document middleware runs, and encrypts the password, and set the 'passwordConfirm' to 'undefined'.

*/
