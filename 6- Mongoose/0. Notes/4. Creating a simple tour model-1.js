//* Creating a simple tour model-1

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
  .then(() => console.log("DB connection successful!")); //just using an empty arrow function and not 'con'.

//Mongoose model is like a blueprint that we use to create documents. So it's a bit like classes in JavaScript, which we use as blueprints in order to create objects out of them. So to perform each of the CRUD operation, we need a Mongoose model, and in order to create a model, we actually need a schema. And we use the schema to describe our data, to set default values, to validate the data etc.
const schema = new mongoose.Schema({
  name: String,
  price: Number,
  rating: Number,
});

//* START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
