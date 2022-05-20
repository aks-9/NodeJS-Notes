//* Creating a simple tour model-2

//* we will create schema type options and a model based on our schema.

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

// defining something called 'schema type options' for each field, or only for some specific field. So let's start here with the name, and instead of just specifying it as a string, let's actually pass in another object. And so now, we say that we want the type to be string but we can now define a couple more options, and they can be different for different types, for example the number type has some different schema options than the string here, but many of them are also similar.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"], // here in the 'required' we can actually specify the error that we want to be displayed when we're missing this 'name' field. So, in order to do that we just have to pass in an array, and the first element is true, and the second one is the 'error' string. This is known as a validator.
    unique: true, // now we can't have two tour documents with the same name.
  },
  price: {
    type: Number,
    required: [true, "A tour must have a name"],
  },
  rating: {
    type: Number,
    default: 4.5, //if we'd now create a new tour document using this schema and not specifying the rating, it would then automatically be set to 4.5.
  },
});

// Creating a model from 'tourSchema'
const Tour = mongoose.model("Tour", tourSchema); //always use uppercase on model names and variables.

//* START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
