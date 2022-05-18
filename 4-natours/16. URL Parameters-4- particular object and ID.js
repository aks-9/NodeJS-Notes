//* URL Parameters-4

//* Get a particular object of a particular id

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

//For handling ID parameter. Now all we need to do is to actually get the 'tour' with this ID from our from the 'tours' array
app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; //Now actually, the parameters returned in the terminal's console are actually strings, so we need to convert that to a number. So when we multiply a string that looks like a number, when we multiply that with another number, it will then automatically convert that string to a number.

  const tour = tours.find((element) => element.id === id); //Using 'find' method on 'tours' array. It'll loop through the array, and in each of the iterations, we will have access to the current element, and we will return either 'true' or 'false' in each of the iterations.

  //It will create an array which only contains the element where this comparison turns out to be 'true'. So using this callback function here with this comparison, we will ensure that only the element where the ID is actually equal to the specified ID in the parameters will get returned from the 'find' method and stored into 'tour'.

  //Now our tour ready to send.

  res.status(200).json({
    status: "success",
    data: {
      tour, //sending 'tour' in 'data'.
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  //* Persisting 'newTour' into the file
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
    "status": "success",
    "data": {
        "tour": {
            "id": 5,
            "name": "The Sports Lover",
            "duration": 14,
            "maxGroupSize": 8,
            "difficulty": "difficult",
            "ratingsAverage": 4.7,
            "ratingsQuantity": 28,
            "price": 2997,
            "summary": "Surfing, skating, parajumping, rock climbing and more, all in one tour",
            "description": "Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\nVoluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur!",
            "imageCover": "tour-6-cover.jpg",
            "images": [
                "tour-6-1.jpg",
                "tour-6-2.jpg",
                "tour-6-3.jpg"
            ],
            "startDates": [
                "2021-07-19,10:00",
                "2021-09-06,10:00",
                "2022-03-18,10:00"
            ]
        }
    }
}



And in the terminal console, you will see the following log:

{ id: '5' }

==> So this is how we get a particular object of a particular id.


*/
