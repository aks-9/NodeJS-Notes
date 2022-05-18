//* RETURNING VALUES FROM ASYNC FUNCTIONS-2

//* Returning a pending promise.

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

const getDogPic = async () => {
  try {
    const data = await readFileProm(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    writeFileProm("dog-img.txt", res.body.message);
    console.log("Random dog image saved to file!");
  } catch (err) {
    console.log(err);
  }
  return "2: READY 🐶"; //LOGGING.
};
console.log("1: Will get dog pics!");

const x = getDogPic(); //saving in a const.
console.log(x); //LOGGING. ///This will return a 'pending' promise, as JavaScript can not know that 'x' will be this 'READY' string at some point. And so it simply moves on to the next console.log. And by the time that JavaScript actually knows that this 'x' should be the string that we returned at that point, this code here has long finished executing.

console.log("3: Done getting dog pics!"); //LOGGING as 3

/*
OUTPUT:

1: Will get dog pics!
Promise { <pending> }         ///an Async function actually returns a promise automatically. So instead of logging 'READY' to the console at this point, it just tells us that 'x' is a promise, which at this point is still running, and so it's still 'pending'.



3: Done getting dog pics!
Breed: labrador
https://images.dog.ceo/breeds/labrador/JessieIncognito.jpg
Random dog image saved to file!

*/
