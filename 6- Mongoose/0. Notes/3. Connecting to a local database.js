//* Connecting to a local database

// This is 'server.js' file.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// Connecting to a remote DB
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('DB connection successful!')); //just using an empty arrow function and not 'con'.

// Connecting to a local DB
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

//* START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

//go ahead and delete the 'tours' collection that we already created in our database just so that our Mongoose driver does not interfere with that in any way.
