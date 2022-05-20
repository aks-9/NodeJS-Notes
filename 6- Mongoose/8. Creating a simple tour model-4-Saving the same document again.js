//* Creating a simple tour model-4

//* Saving the same document again.
// This is 'server.js' file.

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

/* 

If we try to save the same document again, it will show an error in the terminal:

'E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: "The Forest Hiker" }',
[Symbol(mongoErrorContextSymbol)]: {}

*/

//schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true, //and the error that we see is this 'duplicate key error collection', which says this duplicate key. So we already have a tour with the name of 'The Forest Hiker,' and so now we were trying to create another one with the same name, and since in our schema we have this 'unique' property, that is not allowed. So we set this 'unique' here to 'true' in order to make it impossible to have two tours with the same name.
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});

const Tour = mongoose.model("Tour", tourSchema); //model

//document.
const testTour = new Tour({
  name: "The Forest Hiker",
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("ERROR💥", err);
  });

//* START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
