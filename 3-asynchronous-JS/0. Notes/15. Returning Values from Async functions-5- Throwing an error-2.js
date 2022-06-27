//* RETURNING VALUES FROM ASYNC FUNCTIONS-5

//* Throwing an error-2

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
    const data = await readFileProm(`${__dirname}/doggggg.txt`); //mispelling
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    writeFileProm("dog-img.txt", res.body.message);
    console.log("Random dog image saved to file!");
  } catch (err) {
    console.log(err);
    throw err; //to mark the returned promise as 'rejected' we will have to do something called 'throwing an error' in the catch block. So we use a built in JavaScript 'throw()' function. So this will now mark this entire function of this promise as 'rejected'.
  }
  return "2: READY 🐶";
};
console.log("1: Will get dog pics!");

getDogPic()
  .then((x) => {
    console.log(x);
    console.log("3: Done getting dog pics!");
  })
  .catch((err) => {
    console.log("I could not find that file 😢"); //The rejected 'promise' will come here.
  });

/*
OUTPUT:

1: Will get dog pics!
I could not find that file 😢
I could not find that file 😢  ///throwing an error as promise is marked as 'rejected'.

*/
