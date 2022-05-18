//* RETURNING VALUES FROM ASYNC FUNCTIONS-1

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
};
console.log("1: Will get dog pics!"); //LOGGING
getDogPic();
console.log("2: Done getting dog pics!"); //LOGGING

/*
OUTPUT:

1: Will get dog pics!
2: Done getting dog pics! ///this got printed first, as getDogPic() is an Async function, and was offloaded to background exectution.

 ///Once getDogPic() is resolved:
Breed: labrador
https://images.dog.ceo/breeds/labrador/n02099712_5787.jpg
Random dog image saved to file!

*/
