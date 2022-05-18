//* Callbacks to Promises-5

//* Using promises with Async and Await, a new feature introduced to JavaScript in ES8.

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

const writeFileProm = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write file 😢");
      resolve("success");
    });
  });
};

// These 'async' functions will do asynchronous work without ever blocking the Event Loop and will also automatically return a Promise.
const getDogPic = async () => {
  const data = await readFileProm(`${__dirname}/dog.txt`); //inside an 'async' function we can always have one or more 'await' expressions. After the 'await' we write the code that returns a promise.
  //Now if the 'Promise' is fulfiled, then the value of the 'await' expression is the resolved value of the 'Promise', which is then finally assigned to the 'data' variable

  console.log(`Breed: ${data}`);

  const res = await superagent.get(
    `https://dog.ceo/api/breed/${data}/images/random`
  ); //waiting for promise to resolve, and then saving it in a variable.
  console.log(res.body.message); //logging to console

  writeFileProm("dog-img.txt", res.body.message); //writing to file.
  console.log("Random dog image saved to file!"); //logging to console
};

getDogPic(); // calling the async function to make it work

// Chaining of 'then' handlers.
// readFileProm(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFileProm("dog-img.txt", res.body.message);
//   })
//   .then(() => {
//     console.log("Random dog image saved to file!");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

/*


OUTPUT:
Breed: labrador
https://images.dog.ceo/breeds/labrador/JessieIncognito.jpg
Random dog image saved to file!



*/
