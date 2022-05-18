//* RETURNING VALUES FROM ASYNC FUNCTIONS-6

//* Throwing an error-3

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
    const data = await readFileProm(`${__dirname}/doggggg.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    writeFileProm("dog-img.txt", res.body.message);
    console.log("Random dog image saved to file!");
  } catch (err) {
    console.log(err); //So it says 'I could not find that file', so this log is coming from this 'catch' block here but then also at the same time it will 'throw an error'.
    throw err; //And when it throws an error, that will then mark this entire promise as rejected.
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
    console.log("ERROR 💥"); //And so that's why we then enter the catch log down here. Which will then, of course in turn trigger this console.log of this error.
  });

/*

  

OUTPUT:
1: Will get dog pics!
I could not find that file 😢
ERROR 💥



*/
