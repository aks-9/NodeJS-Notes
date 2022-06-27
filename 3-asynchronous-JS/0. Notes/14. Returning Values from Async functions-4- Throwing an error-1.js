//* RETURNING VALUES FROM ASYNC FUNCTIONS-4

//* Throwing an error-1

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
    const data = await readFileProm(`${__dirname}/doggggg.txt`); //trying to cause an error.
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
  return "2: READY 🐶"; //This will still be returned even if there is an error, the promise will still be marked as successful.
};
console.log("1: Will get dog pics!");

getDogPic()
  .then((x) => {
    console.log(x);
    console.log("3: Done getting dog pics!");
  })
  .catch((err) => {
    console.log(err); //And even if we add our catch handler down here that will not change the fact that promise is returned as successful.
  });

/*
OUTPUT:

1: Will get dog pics!
I could not find that file 😢  ///This coming from getDogPic()'s catch block.
2: READY 🐶   ///Still getting this string, even though there is an error.
3: Done getting dog pics!

This problem can be handled by 'thowing an error'.

*/
