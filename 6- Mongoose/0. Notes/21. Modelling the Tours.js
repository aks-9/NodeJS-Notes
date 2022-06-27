//* Modelling the Tours

//This is 'tourModel.js' file.

//? Adding more details in our schema.

const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true, // only work for strings, it removes all the whitespace from the begining and the end of a string
  },
  duration: {
    //added
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    //added
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    //added
    type: String,
    required: [true, "A tour must have a dificulty"],
  },
  ratingsAverage: {
    //added
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    //added
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
    trim: true, // only work for strings, it removes all the whitespace from the begining and the end of a string
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a imageCover"],
  },
  images: [String], // Here we have multiple images, and I want to save those images as an array. And actually, as an array of strings.
  createdAt: {
    // This should basically be a timestamp that is set by the time that the user gets a new tour
    type: Date,
    default: Date.now(),
  },
  startDates: [Date], // These 'startDates' are basically different dates at which a tour starts. This one here will not be automatically created by MongoDB, and MongoDB will then automatically try to parse the string that we passed in as the date into a real JavaScript date.
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*

Go to dev-data/tours-simple.json and copy one object like this:

{
    "id": 2,
    "name": "The Snow Adventurer",
    "duration": 4,
    "maxGroupSize": 10,
    "difficulty": "difficult",
    "ratingsAverage": 4.5,
    "ratingsQuantity": 13,
    "price": 997,
    "summary": "Exciting adventure in the snow with snowboarding and skiing",
    "description": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!\nDolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!",
    "imageCover": "tour-3-cover.jpg",
    "images": ["tour-3-1.jpg", "tour-3-2.jpg", "tour-3-3.jpg"],
    "startDates": ["2022-01-05,10:00", "2022-02-12,10:00", "2023-01-06,10:00"]
  }

Now we will use this data to create a new POST request in Postman. Make sure the name doesn't already exists in the database.

Then this will create a new tour with all the entries we have provided.


*/
