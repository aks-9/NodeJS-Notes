//* Patch Requests

//* Updating the data with the help of 'Patch' method.

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

//Handler for 'Patch' request
app.patch("/api/v1/tours/:id", (req, res) => {
  //checking for invalid ID
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tours: "<Updated tour here...>",
    },
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 

Go to Postman, and in the address bar paste 127.0.0.1:3000/api/v1/tours/3

Make sure to select 'Patch' method. Save this request as 'Update Tour' in the 'Natours' collection in the Postman app.

Then in Postman app, specify 'body' , i.e. the data that we want to send to the server for update. We go to 'Body' , and select, 'raw' radio-button, and then under the dropdown arrow labelled as 'Text', select 'JSON'.

So we will update the 'duration' of tour number 3. Everything has to be in double quotes like this:

{
    "duration": 15
}

Make sure the nodemon app is running. Click send in the Postman app.

It should give you this output in the Postman app:

{
    "status": "success",
    "data": {
        "tours": "<Updated tour here...>"
    }
}


==> Keep in mind, that this will of course not change anything in our JSON file because we did not implement that.

If you test it with a wrong ID like 33, like this: 127.0.0.1:3000/api/v1/tours/33

It should also give the error like this:

{
    "status": "fail",
    "message": "Invalid ID"
}

*/
