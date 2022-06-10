//* Better Errors and Refactoring- 1

// creating a seperate error class.

// create a new file called 'appError.js' in the 'utils' folder.
//This is 'appError.js' file

class AppError extends Error {
  //inheriting
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // 'err.stacktrace' show where error happened
    //at first we need to specify the current object, which is 'this', and then the AppError class itself, which is gonna be 'this.constructor'. Okay, and so this way when a new object is created, and a constructor function is called, then that function call is not gonna appear in the stack trace, and will not pollute it.
  }
}

module.exports = AppError;
