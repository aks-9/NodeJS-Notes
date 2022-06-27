//* Handling POST method-2

//* Persist the data into a local file(database).

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

//Reading data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Route Handler for GET
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

//Route Handler for POST
app.post("/api/v1/tours", (req, res) => {
  // console.log(req.body);
  //The first thing we need to do is to figure out the ID of the new object. Remember, when we create a new object, we never specify the ID of the object. The database usually takes care of that. But in this case, we do not have any real database, and so what we're gonna do is to simply take the ID of the last object and then add +1 to that.

  const newId = tours[tours.length - 1].id + 1; //we already have the data in this 'tours' variable from reading the data earlier. So that's an array of all the tour objects, 9 to be precise, and so we want to get the last one, which is 'tours.length - 1', then use the 'id' property on that, and finally we add + 1. So that is the new ID.

  const newTour = Object.assign({ id: newId }, req.body); //Here we create a 'newTour', and that tour will have the 'body' data that we send, plus the 'newId' that we just created. So we can use 'object.assign' method, which allows us to create a new object by merging two existing objects together.

  tours.push(newTour); //Pushing the 'newTour' in the array of all tours.

  //* Persisting 'newTour' into the file
  // We are inside of a call-back function, that is gonna run in the event loop. So we can never, ever block the event loop. So we're gonna do is to use 'writeFile' and not the 'writeFileSync' in this one.

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`, //The first argument is the path to the file where we need to persist the data.
    JSON.stringify(tours), // The second argument is the data in the 'tours' we want to persist, but first it needs to be stringified as right now it is just a plain, normal JavaScript object. The third argumnet is the callback function.
    (err) => {
      res.status(201).json({
        //And then we will send the newly created object as the response. So status code is '201' which means 'created'. As we created a new resource on a server.
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );

  // res.send('Done'); Can't send two responses.
});
const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 

Now when you send from Postman, the output should be this:
 
{
    "status": "success",
    "data": {
        "tour": {
            "id": 10,
            "name": "Test Tour",
            "duration": 10,
            "difficulty": "easy"
        }
    }
}

So we have our id of 10, which our code created for us, and then the entire tour which is exactly the data that we sent as a body in our request from Postman.

*/
