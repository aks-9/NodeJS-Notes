//* Errors During Development vs Production -1

//This is 'errorController.js' file

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    //adding
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    //adding
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message
  // });
};
