//* Query Middleware -2

// This is 'tourModel.js' file.

//* right now this middleware is running for find, but not for findOne

//So we have the Secret Tour and its ID, and so if we Get A Tour with this ID, then that should give us the Super Secret Tour here. So filter that we just built in the middleware is not working for this command. Because the handle function for this route, is using 'findByID', which, behind the scenes, is 'findOne', and so it's different from 'find'. So, we need to specify the same middleware also for 'findOne' using a regular expression.

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

//pre document middleware
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// post document middleware
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//* QUERY MIDDLEWARE
// This middleware should be executed not only for 'find', but for all the commands that start with the name 'find'. So, 'find', and 'findOne', and also 'findOneAndDelete', 'findOneAndUpdate', and so all of these will now actually trigger this middleware function that we have here.

// tourSchema.pre('find', function(next) {
//So again, this '^find' simply means all the strings that start with find.
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*

In the Mongoose documentations: https://mongoosejs.com/docs/middleware.html

document middleware can also run for stuff like remove. All right? Or for validate. Okay, but I didn't talk about these because usually the one that we always use is just for save. Now, query middleware can run for all of these query functions.

Now, query middleware can run for all of these query functions.

==> So when we now 'Get A Tour 'with this Secret Tour's ID, it should have no results. And indeed, it doesn't. Because, remember, we were trying to get a secretTour. So the tour with this ID here is secret, but we never want the secretTours to show up in any query. And so that's why, right now, we get zero results.
 
*/
