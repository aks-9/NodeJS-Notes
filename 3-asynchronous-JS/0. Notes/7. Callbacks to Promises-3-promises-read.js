//* Callbacks to Promises-3

//* Using promises on the read and write file functions.
//We will refactor them so that they return promises instead of us passing a callback functions into them.

const fs = require("fs");
const superagent = require("superagent");

//it's basically a read file function that returns a promise and that only receives a file name, no callback.
const readFileProm = (file) => {
  return new Promise((resolve, reject) => {
    //using the ES6 Promise constructor, which takes in a so called 'executor' function, which will get called immediately when a promise is created. And this 'executor' function will take in two arguments 'resolve' and 'reject'.

    //we're simply creating a new function which behind the scenes ofcourse still runs the built in 'readFile' function but then returns a 'promise' so that we can use the 'promise' instead of the callback function.

    fs.readFile(file, (err, data) => {
      //So we have that 'readFile' function here which will do its work and when it's ready will come back with the 'data', that's when the 'resolve' and the 'reject' functions come into play. Because both these arguments that are available in the 'executor' function they are both functions as well.

      if (err) reject("I could not find that file 😢"); // We can also mark the 'promise' as 'rejected' in case there was an error. And we do that by calling the 'reject' function. So if there was an error here, then call the 'reject' function. And whatever we pass into this one will be later available in the 'catch' method.

      resolve(data); //calling the 'resolve' function will basically mark the 'promise' as successful so as 'fulfilled', and return the successful value from the 'promise'. So whatever variable that we pass into the 'resolve' function will be later available as the argument in the 'then' method. So this 'data' here will be the value that this 'promise' returns to us.

      /* 
      
      ==> So we created a new variable 'readFileProm', in there we will pass a 'file' name. And all we do here is to return a new 'Promise'. 
      
      This 'promise' takes in one 'executor' function, which is where we do our asynchronous work, which is our fs.readFile(). 
      
      Then if we get our data in a successful way we call the 'resolve' function with the resolve value. And if there is an error we call the 'reject' function. 
      
      */
    });
  });
};

readFileProm(`${__dirname}/dog.txt`).then((data) => {
  //We pass in our file name. So this will now return a promise. And so we can then use our 'then' method on that. This 'data' argument here will be exactly what we returned from the promise in case it was successful.
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log("Random dog image saved to file!");
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//TODO Moved the following code:
//! console.log(`Breed: ${data}`);

//! superagent
//!   .get(`https://dog.ceo/api/breed/${data}/images/random`)
//!   .then((res) => {
//!     console.log(res.body.message);

//!     fs.writeFile("dog-img.txt", res.body.message, (err) => {
//!       if (err) return console.log(err.message);
//!       console.log("Random dog image saved to file!");
//!     });
//!   })
//!   .catch((err) => {
//!     console.log(err.message);
//!   });
//TODO  above in the

//? readFileProm(`${__dirname}/dog.txt`)
//?   .then(data => {

//?    });
// });

/*
Now run it and it should still show the same result.

OUTPUT:
Breed: labrador
https://images.dog.ceo/breeds/labrador/n02099712_5338.jpg
Random dog image saved to file!

*/
