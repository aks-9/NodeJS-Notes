//* Errors During Development vs Production -2

//This is 'errorController.js' file

//adding
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//adding
const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    //! Moved to sendErrorDev();
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   error: err,
    //   message: err.message,
    //   stack: err.stack
    // });

    sendErrorDev(err, res); //adding
  } else if (process.env.NODE_ENV === "production") {
    //! Moved to sendErrorProd()
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   message: err.message
    // });

    sendErrorProd(err, res); //adding
  }
};
