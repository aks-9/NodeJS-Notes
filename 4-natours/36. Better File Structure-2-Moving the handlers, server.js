//* A better file structure-2
//This is 'app.js file.'

//* Removing the route handlers from the routes file, creating a seperate 'server.js' file.

// This 'app.js' file is mainly used for 'middleware' declarations. So we have here all our 'middleware' that we want to apply to all the routes. The most important thing to keep in mind is that we created these different routers for each of the resources, to have a nice separation of concern between these resources. So basically creating one small sub-application for each of them and then putting everything together in one main app.js file.

// Create a new folder called 'controllers'. So we've been calling them 'route handlers', and so it would make sense to create a 'handlers' folder. But later in this course, we will start using a software architecture called the 'Model View Controller', and in that architecture, these 'handler functions' here are actually called 'controllers'. And so that's why we're going to call the folder, and also the files in there, as 'controllers'.

//Now create 'tourController.js' and 'userController.js' files in the 'controllers' folder.

const express = require("express");
const morgan = require("morgan");
const app = express();

const tourRouter = require("./routes/tourRoutes"); //importing the routers from their file
const userRouter = require("./routes/userRoutes"); //importing the routers from their file

//* 1) MIDDLEWARES

app.use(morgan("dev"));
app.use(express.json());
//global middleware-1
app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");
  next();
});
//global middleware-2
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* 2) ROUTE HANDLERS
//! Moved to 'tourController.js' file
// const getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   console.log(req.params);
//   const id = req.params.id * 1;
//   const tour = tours.find((element) => element.id === id);

//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// const updateTour = (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours: '<Updated tour here...>',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

//! Moved to 'userController.js' file
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     //status code '500' means internal server error.
//     status: 'error',
//     message: 'This route is not yet implemented',
//   });
// };

// const createUser = (req, res) => {
//   res.status(500).json({
//     //status code '500' means internal server error.
//     status: 'error',
//     message: 'This route is not yet implemented',
//   });
// };

// const getUser = (req, res) => {
//   res.status(500).json({
//     //status code '500' means internal server error.
//     status: 'error',
//     message: 'This route is not yet implemented',
//   });
// };

// const updateUser = (req, res) => {
//   res.status(500).json({
//     //status code '500' means internal server error.
//     status: 'error',
//     message: 'This route is not yet implemented',
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     //status code '500' means internal server error.
//     status: 'error',
//     message: 'This route is not yet implemented',
//   });
// };

//* 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//! Now create a 'server.js' file and move the code for starting the server, in it.

//START SERVER
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on ${port}...`);
// });

//because it's a good practice to have everything that is related to express in one file, and then everything that is related to the server in another main file. So from now, 'server.js' will actually be our starting file where everything starts, and it's there when we listen to our server.

module.exports = app; //exporting the 'app', so that it can be imported in out 'server.js' file.
