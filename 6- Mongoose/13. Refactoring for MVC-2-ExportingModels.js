//* Refactoring for MVC-2

//This is 'tourModel.js' file.

const mongoose = require("mongoose"); //importing

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

module.exports = Tour; //exporting
