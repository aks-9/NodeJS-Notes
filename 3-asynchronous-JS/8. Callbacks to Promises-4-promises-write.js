//* Callbacks to Promises-4

//* Using promises on the write file function.

const fs = require("fs");
const superagent = require("superagent");

const readFileProm = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find that file 😢");
      resolve(data);
    });
  });
};

//Using promises on the write file function.
const writeFileProm = (file, data) => {
  //this one needs a file name and also the data that should be written to that file.
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write file 😢");
      resolve("success"); //passing random string. A promise doesn't always have to return a meaningful value
    });
  });
};

//* Chaining of 'then' handlers.
readFileProm(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`); // We will chain these 'then' handlers here. And the secret to doing that is to make each handler return a new promise. Remember '.get' function returns a promise. And so all we have to do is to return that promise from this first 'then' handler.

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`); //Returning a promise
  }) //closing the callback here, and chaining it to a 'then' handler.
  .then((res) => {
    //So this 'res' variable here will then be the resolved value of the promise that returned from the previous handler.
    console.log(res.body.message);

    return writeFileProm("dog-img.txt", res.body.message); //And since we want to keep chaining the 'then' methods we will again return that actually

    // fs.writeFile("dog-img.txt", res.body.message, (err) => {
    //   if (err) return console.log(err.message);
    //   console.log("Random dog image saved to file!");
    // });
  })
  .then(() => {
    //chaining the next 'then' handler.
    console.log("Random dog image saved to file!");
  })
  .catch((err) => {
    console.log(err.message); //for all of these chains 'then' handlers in the end, we simply need one single 'catch' handler.
  });

/*


OUTPUT:
 Breed: labrador
https://images.dog.ceo/breeds/labrador/JessieIncognito.jpg
Random dog image saved to file!

==> The trick for being able to chain all of these then methods here is to return a promise before calling each of them.


*/
