//* Document Middleware- 2 -pre document middleware

// This is 'tourModel.js' file.

//? We will create a slug for each of these documents. For that install 'npm i slugify' package

const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    slug: String, /// ADDING A SLUG IN SCHEMA
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
    priceDiscount: Number,
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
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//* DOCUMENT MIDDLEWARE: runs before .save() and .create() but not on insertMany

//pre document middleware
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true }); //'this' is the currently processed document. So we can now define a new property 'this.slug' on it, Followed by a 'string' from which we want to create a slug, and so that's gonna be 'this.name' and then we also want to pass in the option that everything should be converted to lower case.

  //just like in Express, we also have the next function in Mngoose middleware, basically to call the next middleware in the stack
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*
Create a new tour 
127.0.0.1:3000/api/v1/tours

{
    "name": "Test Tour 8",
    "duration": 10,
    "difficulty": "easy",
    "maxGroupSize": 1,
    "price": 100,
    "rating": 4.7,
    "summary": "test tour",
    "imageCover" : "tour-3-cover.jpg"
}


Output TO NOTE:

{
  "slug": "test-tour-8",
}
POST /api/v1/tours 201 103.932 ms - 392

==> and now indeed we have the slug property right here and it is indeed based on the name.
*/
