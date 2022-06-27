//* Callbacks to Promises-6

//* Error handling in Async and Await - Try and Catch

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
    //wrapping the whole code in a try block
    const data = await readFileProm(`${__dirname}/doggggggggggggggg.txt`); //mispell the file name to cause an error
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    writeFileProm("dog-img.txt", res.body.message);
    console.log("Random dog image saved to file!");
  } catch (err) {
    //catch block to handle the error.
    console.log(err);
  }
};

getDogPic();

/*




OUTPUT:
I could not find that file 😢



*/
