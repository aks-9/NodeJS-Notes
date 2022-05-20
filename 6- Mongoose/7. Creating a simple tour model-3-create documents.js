//* Creating a simple tour model-3

//* we will create documents based on our model.

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

//schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
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

//this will be a new document created out of the 'Tour' model
const testTour = new Tour({
  name: "The Forest Hiker",
  rating: 4.7,
  price: 497,
});

//this 'testTour' document that we just created is an 'instance' of the 'Tour' model, and so now it has a couple of methods on it that we can use in order to interact with the database.

//using 'save()'method on 'testTour' document, to save it to the 'tours' collection in the database. Now this 'save()' here will then return a promise that we can then consume.
testTour
  .save()
  .then((doc) => {
    //here, we get access to the 'document' that was just saved to the database. So the result value of the promise that the save method returns is the final document as it is in the database.
    console.log(doc);
  })
  .catch((err) => {
    //saving this document to the database might also go wrong, and so let's catch that error.
    console.log("ERROR💥", err);
  });

//* START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/*
Run npm start again, and it should print the following output.

OUTPUT:

DB connection successful!
{
  rating: 4.7,
  _id: 62878fc660d80a0404264b92,
  name: 'The Forest Hiker',
  price: 497,
  __v: 0
}
*/
