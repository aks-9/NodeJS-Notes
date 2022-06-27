//* URL Parameters-1

//* Defining parameters in the URL, and assigning it a value using 'req.params'

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

//For handling parameters
app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params); //This is where all the parameters that we define in the URL are stored

  res.status(200).json({
    status: "success",
    // results: tours.length,
    // data: {
    //   tours: tours,
    // }
  });
});

//Route Handler for POST
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

Go to Postman, and in the address bar paste 127.0.0.1:3000/api/v1/tours/5

It should give you this output:

{
    "status": "success"
}

And in the terminal console, you will see the following log:
{ id: '5' }

==> So, 'req.params' is a very nice object which automatically assigns the value to our parameter that we defined in the URL.
*/
