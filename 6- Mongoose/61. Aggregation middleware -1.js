//* Aggregation middleware -1

// This is 'tourModel.js' file.

//* aggregation middleware allows us to add hooks before or after an aggregation happens

// Now in an aggregation the secret tours are still being used. In Postman, 'Get All Tours' gives only 9 tours in results, but if we try 'Get Tour Stats' it shows the stats of 10 tours, that's because one tour is secret. And now we don't want it to show up in 'Get Tour Stats' as well, so we will use an aggregation middleware.

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

// Our aggregation is actually happening in 'getTourStats' method in the 'tourController.js' file. Now we could simply exclude the secret tours that are true in this 'match' stage. But then we would have to add the same thing down in the other aggregation that we have, so it's better to simply exclude it right at the model level.

//* AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  // Using 'aggregate' hook
  console.log(this.pipeline()); // 'this' is going to point to the current aggregation object. Logging the pipeline method.
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*
Go to Postman > Get Tour Stats >

And in the terminal we will have the aggregation pipeline, and so that's simply the array that we passed into the aggregate function earlier, in 'getTourStats' method in the 'tourController.js' file. So we have a '$match' , '$group'  and a '$sort'

Terminal:

[
  { '$match': { ratingsAverage: [Object] } },
  {
    '$group': {
      _id: [Object],
      numTours: [Object],
      numRatings: [Object],
      avgRating: [Object],
      avgPrice: [Object],
      minPrice: [Object],
      maxPrice: [Object]
    }
  },
  { '$sort': { avgPrice: 1 } }
]


Now in order to filter out the secret tours all we have to do is to add another 'match' stage right at the beginning of this pipeline array, in the next part.



 
*/
