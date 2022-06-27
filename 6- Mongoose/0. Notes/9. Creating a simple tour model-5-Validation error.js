//* Creating a simple tour model-5

//* Validation error

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
  name: "The Park Camper", //the price is a required field, and if we don't pass it then, we'll get a validation error.
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

OUTPUT:

ERROR💥 Error [ValidationError]: Tour validation failed: price: A tour must have a price
    at ValidationError.inspect (D:\Work\NodeJS\6- Mongoose\starter\node_modules\mongoose\lib\error\validation.js:59:24)
    at formatValue (node:internal/util/inspect:780:19)
    at inspect (node:internal/util/inspect:345:10)
    at formatWithOptionsInternal (node:internal/util/inspect:2165:40)
    at formatWithOptions (node:internal/util/inspect:2027:10)
    at console.value (node:internal/console/constructor:324:14)
    at console.log (node:internal/console/constructor:360:61)
    at D:\Work\NodeJS\6- Mongoose\starter\server.js:56:13
    at processTicksAndRejections (node:internal/process/task_queues:96:5) {
  errors: {
    price: MongooseError [ValidatorError]: A tour must have a price
        at new ValidatorError (D:\Work\NodeJS\6- Mongoose\starter\node_modules\mongoose\lib\error\validator.js:29:11)
        at validate (D:\Work\NodeJS\6- Mongoose\starter\node_modules\mongoose\lib\schematype.js:975:13)
        at D:\Work\NodeJS\6- Mongoose\starter\node_modules\mongoose\lib\schematype.js:1028:11
        at Array.forEach (<anonymous>)
        at SchemaNumber.SchemaType.doValidate (D:\Work\NodeJS\6- Mongoose\starter\node_modules\mongoose\lib\schematype.js:984:19)       
        at D:\Work\NodeJS\6- Mongoose\starter\node_modules\mongoose\lib\document.js:2098:9
        at processTicksAndRejections (node:internal/process/task_queues:78:11) {
      properties: [Object],
      kind: 'required',
      path: 'price',
      value: undefined,
      reason: undefined,
      [Symbol(mongoose:validatorError)]: true
    }
  },
  _message: 'Tour validation failed'
}

*/
