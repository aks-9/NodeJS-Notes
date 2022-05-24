//* Field Limiting- 2

//This is 'tourModel.js' file.

//* Excluding fields from the schema, that can be very useful, for example, when we have sensitive data that should only be used internally.

//For example, we might not want the user to see when exactly each tour was created. For example, tour might already be kind of old or something and so, let's say we want to always hide this 'createdAt' field

const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a dificulty"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: Number, //added
  summary: {
    type: String,
    required: [true, "A tour must have a summary"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a imageCover"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, //hiding this field from the client. Now if you go to Postman, and try 'get All Tours', none of the resuls will show the 'createdAt' field.
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*


*/
