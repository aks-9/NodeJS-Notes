//* RETURNING VALUES FROM ASYNC FUNCTIONS-3

//* Returning a value

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
  return "2: READY 🐶"; //If we actually wanted to get this return value in 'x' through the console, we would have to treat this Async function as a promise. And so we would use the 'then' method on it or use Async/Await.
};
console.log("1: Will get dog pics!");

//instead of trying to save the returned value from getDogPic() to a variable 'x', we can use the 'then' method on it.
getDogPic().then((x) => {
  console.log(x);
  console.log("3: Done getting dog pics!");
});

/*
OUTPUT:
1: Will get dog pics!
Breed: labrador
https://images.dog.ceo/breeds/labrador/n02099712_4384.jpg
Random dog image saved to file!
2: READY 🐶  ///Returned value from an async function.
3: Done getting dog pics!

*/
