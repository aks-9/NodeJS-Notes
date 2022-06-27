//* URL Parameters-3

//* Optional Parameters

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

//For handling optional parameters, we add a "?" after a parameter, so it will not give error if we don't specify Y parameter now.
app.get("/api/v1/tours/:id/:x/:y?", (req, res) => {
  console.log(req.params);

  res.status(200).json({
    status: "success",
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

Go to Postman, and in the address bar paste 127.0.0.1:3000/api/v1/tours/5/23

It should give you this output:

{
    "status": "success"
}

And in the terminal console, you will see the following log:

{ id: '5', x: '23', y: 'undefined' }


*/
