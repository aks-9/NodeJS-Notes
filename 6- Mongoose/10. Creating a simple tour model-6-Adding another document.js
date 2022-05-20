//* Creating a simple tour model-6

//* Adding another document
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

//document.
const testTour = new Tour({
  name: "The Park Camper",
  price: 997, //Adding price which is required, but rating is not required in schema. So this will not give error, and a new document will be created. The default rating of 4.5 will be used.
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

/*


*/
