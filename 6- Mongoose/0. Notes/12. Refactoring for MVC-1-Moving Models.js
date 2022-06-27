//* Refactoring for MVC-1

//*Creating Models in a seperate folder

// This is 'server.js' file.

//Create a new folder called 'models', and create a new file called 'tourModel.js' in it.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//Connecting to a remote DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

//! Moving the schema and the model to 'tourModel.js'
// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'A tour must have a name'],
//     unique: true
//   },
//   rating: {
//     type: Number,
//     default: 4.5
//   },
//   price: {
//     type: Number,
//     required: [true, 'A tour must have a price']
//   }
// });

// const Tour = mongoose.model('Tour', tourSchema); //model

//! document. This was for testing, no longer needed.
// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997
// });

// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('ERROR💥', err);
//   });

//* START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
