//* Query Middleware -1

// This is 'tourModel.js' file.

//? Query middleware allows us to run functions before or after a certain query is executed.

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
      //Adding secret tour in schema
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
tourSchema.pre("find", function (next) {
  //The only difference here is really this 'find' hook, which will make this query middleware and not document middleware.

  //So let's suppose that we can have secret tours in our database, like for tours that are only offered internally, or for a very small, like, VIP group of people, and that the public shouldn't know about. Now, since these tours are secret, we do not want the secret tours to ever appear in the result outputs. And so what we're gonna do is to create a secret tour field and then query only for tours that are not secret.

  this.find({ secretTour: { $ne: true } }); //'this' keyword will now point at the current query and not at the current document, because we're not really processing any documents here.

  //keep in mind that 'this' here is now a query object. And so we can chain all of the methods that we have for queries. And so that simply adds a 'find' method here, and then basically select all the documents where 'secretTour' is not 'true' using '$ne' operator which stands for 'not equal to'. And we're doing it like this because, remember, the other tours are not currently set to false. They do simply not have this attribute.

  this.start = Date.now();
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*

Go to Postman, create a secret tour in Postman, so that we can then test using it, So let's call this here the Super Secret Tour.

{
    "name": "Super Secret Tour",
    "duration": 10,
    "difficulty": "easy",
    "maxGroupSize": 1,
    "price": 100,
    "rating": 4.7,
    "summary": "test tour",
    "imageCover" : "tour-3-cover.jpg",
    "secretTour" : true
}

OUTPUT to Notice: 
"secretTour": true,

*/

/*
so let's test it out now again, in 'Get All Tours'. And so it should now be gone here. And indeed, it is no longer here. Okay, we have all the tours that are not secret, but not the secret tour.

And I'm now seeing that we actually have 'secretTour' set to false here, but that's really just a Mongoose thing, so let's take another look here at Compass, and reload. And so you see that, actually, in the database, 'secretTour' is not set to false. Mongoose is simply adding that because we have it in our schema as the default, and it's not in the database.

And so it's basically, then, putting it there anyway. So you see that we actually have 11 documents, but then here in Postman we only get ten results. And that is, of course, because our Secret Tour is basically filtered out.


==> let's try to understand again what really happens. So as soon as we hit this route, 'Get All Tours', we create a query using 'Tour.find()'. And then, of course, we chain all methods to it, we then execute that 'features.query' by using await. 

But, before it actually is executed, then, our 'pre-find middleware' here is executed. Okay? And it is executed because it is 'find', So, we're creating a 'find' query, and so the 'find' hook is then executed. 

Then, in  'query middleware', the 'this' keyword points to the query. And so, to that query, we can then chain yet another 'find' method. And in there, we then filter out the 'secretTour' using this filter object.

So basically saying that we only want tours where the 'secretTour' is not equal to 'true'. 
*/
