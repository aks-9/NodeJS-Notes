//* Custom validators-2

// This is 'tourModel.js' file.

//* An npm custom validator library

// there are libraries on npm for data validation that we can simply plug in here as custom validators that we do not have to write ourselves. And the most popular library is called 'validator'.

// install 'npm i validator'

const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      validate: [validator.isAlpha, "Tour name must only contain characters"], // An npm custom validator library. 'isAlpha', which is gonna check if the string contains only letters. we don't call it here. We basically just specify that this is a function that should be used. Just like our own one, like our own validator, we didn't call it.
    },
    slug: String,
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //callback function actually has access to the value that was inputted. So in this case, the price discount that the user specified. So that's what I call the value, val for short.

          // this only points to current doc on NEW document creation
          return val < this.price; //Remember that we need to return either 'true' or 'false' from this validator. When the price discount is less than the price, we return 'true', when the price discount is greater than the price we return 'false', which will trigger a validation error.

          //! inside a validator function, 'this' keyword is only gonna point to the current document when we are creating a new document. So this function here is not going to work on update.
        },
        message: "Discount price ({VALUE}) should be below regular price", //error message. This message here also has access to the value. And this works in kind of a weird way and this really is internal to Mongoose, so this has nothing to do with JavaScript so we can simply use the curly braces here and then VALUE. So this piece here will get access to the value that was inputted, so it has the exact same value as this 'val' variable.
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//PRE DOCUMENT MIDDLEWARE
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

//specify a post middleware for find.
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  //console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*
Postman > Create a new tour:

{
    "name": "TestTour2",
    "duration": 10,
    "difficulty": "easy",
    "maxGroupSize": 1,
    "price": 100,
    "rating": 4.7,
    "summary": "test tour",
    "imageCover" : "tour-3-cover.jpg"
}

This will fail.


But this one will pass:

{
    "name": "TestTourTwo",
    "duration": 10,
    "difficulty": "easy",
    "maxGroupSize": 1,
    "price": 100,
    "rating": 4.7,
    "summary": "test tour",
    "imageCover" : "tour-3-cover.jpg"
}

==>  the problem is the spaces, but obviously we want to keep the spaces here. In fact, this validation error is not really useful and so I will get rid of it. Consider that this here was only to demonstrate that we can use an external library like this to perform validation. And actually, we will still use this library a bit later when we check if the user email is actually valid.

*/
