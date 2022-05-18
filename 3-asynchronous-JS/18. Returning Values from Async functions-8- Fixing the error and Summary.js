//* RETURNING VALUES FROM ASYNC FUNCTIONS-8

//* Fixing the error and Summary

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
    const data = await readFileProm(`${__dirname}/dog.txt`); //Fixing the file name. Now there won't be an error.
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    writeFileProm("dog-img.txt", res.body.message);
    console.log("Random dog image saved to file!");
  } catch (err) {
    console.log(err);
    throw err;
  }
  return "2: READY 🐶";
};

//* Using async await and IIFE
(async () => {
  try {
    console.log("1: Will get dog pics!");
    const x = await getDogPic();
    console.log(x);
    console.log("3: Done getting dog pics!");
  } catch (err) {
    console.log("ERROR 💥");
  }
})();

/* 

OUTPUT:

1: Will get dog pics!
Breed: labrador
https://images.dog.ceo/breeds/labrador/lab_young.JPG
Random dog image saved to file!
2: READY 🐶
3: Done getting dog pics!

==> So we have an Async function and we called it from another Async function, and maybe we even called another Async function from that first Async function, and so we have a bunch of these Async functions interacting with each other. 

And so it's very important that you know how all of this works. 

And again to recap, the most important thing to remember is that an Async function automatically returns a promise, and that the value that we return from an Async function will be the result value of that promise. And so from there, we can simply handle it as yet another promise.

*/
