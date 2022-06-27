//* URL Parameters-6

//* Throwing error in case a specific ID is not found- 2.

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

  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }

  const tour = tours.find((element) => element.id === id);

  //Another solution that we could of course implement here could be to just do a test after we try to get a tour. So we would get the ID, then we would try to find a tour, and if there was no tour, well then we would say that the ID is invalid.

  if (!tour) {
    //So if there is no tour, so if tour is basically undefined, well, then we send back this error message.
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

Save this request as 'Get Tour' in the 'Natours' collection in the Postman app.

*/
