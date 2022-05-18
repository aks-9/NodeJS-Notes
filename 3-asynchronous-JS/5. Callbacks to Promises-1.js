//* Callbacks to Promises-1

//using a promise for the http request instead of the callback. The superagent library actually has support for promises out of the box

//A promise basically implements the concept of a future value. So basically, a value that we are expecting to receive some time in the future

//The state of the promise in the begining, is a 'pending' promise. So if it's still pending, it still hasn't gotten back with any data from the server. Now we need to consume it, meaning we wait for it to come back with the data.

//And to do that, we use the 'then' method on it and pass a callback function. This callback function will then be called as soon as the promise is done doing its work and has come back with the data. And that data is then available as an argument to that callback. Now I like to call that the result.

const fs = require("fs");
const superagent = require("superagent");

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`) //this method here actually returns a promise.
    .then((res) => {
      //Using 'then' method. Data in the callback.
      if (err) return console.log(err.message);
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log("Random dog image saved to file!");
      });
    });

  // a promise as soon as it comes back with the data is called a 'resolved' promise.However, a 'resolved' promise might not always be successful because there might have been an error.
  //So we say that a 'resolved' promise can either be 'fulfilled' or 'rejected'. The 'fulfilled' promise actually has a result that we want to use. While a 'rejected' promise is when there was an error.
});
