//* Query Middleware-3-post middleware for find

// This is 'tourModel.js' file.

//* specify a post middleware for find.

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

// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now(); // a clock to measure how long it takes to execute the current query.  We can simply set a property onto the this object, because this query object is really just a regular object. It has access to all these methods, such as find, but we can also use it to set any property that we want on it. And so here we can say 'this.start' should be the current date.
  next();
});

//specify a post middleware for find.
tourSchema.post(/^find/, function (docs, next) {
  // Here we actually get access to all the documents that we returned from the query. This middleware is gonna run after the query has already executed. And so, therefore, it can have access to the documents that were returned.
  console.log(`Query took ${Date.now() - this.start} milliseconds!`); // Printing the clock
  //console.log(docs);
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*
Go to Postman and 'Get All Tours'

Output:

Query took 60 milliseconds!

==> and so that was basically the time that passed from the beginning, where we defined this, to after the query has executed, at this point in time.
 
*/
