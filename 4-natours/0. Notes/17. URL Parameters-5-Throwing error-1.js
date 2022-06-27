//* URL Parameters-5

//* Throwing error in case a specific ID is not found- 1.

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

  //if we do ID=23 in Postman, we get nothing back. And that's because there is no tour with the ID of 23, but we still return the 200 OK status code, and so, that doesn't make much sense. A very simplistic solution is, to check if the ID is larger than the length of the tours array, and if it is longer, well, then we can send back a 404 error saying that we could not find any tour for the given ID.

  if (id > tours.length) {
    return res.status(404).json({
      //we say return, and that's because we want to exit the function right at this point. We send a status of 404, because we couldn't find any tour for that ID.
      status: "fail", //So fail is what we send whenever we have a 404 code.
      message: "Invalid ID",
    });
  }

  const tour = tours.find((element) => element.id === id);

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

const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
Go to Postman, and in the address bar paste 127.0.0.1:3000/api/v1/tours/23

23 is an invalid ID as it is greater than the length of 'tours' array. It should give you this output:

{
    "status": "fail",
    "message": "Invalid ID"
}

*/
