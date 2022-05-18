//* RETURNING VALUES FROM ASYNC FUNCTIONS-7

//* Using Async/Await for returning values and IIFE (immediately invoked function expression).

//the problem with 'throwing an error' is that it mixes 'promises' with 'Async/Await'. So we have Async/Await, and then all of a sudden we're being back to using 'then' and 'catch' at the bottom.

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
    console.log(err);
    throw err;
  }
  return "2: READY 🐶";
};

//* Using async await and IIFE
(async () => {
  try {
    console.log("1: Will get dog pics!");
    const x = await getDogPic(); //So getDogPic function here is an Async function and so it returns a promise. And the result value of that promise is '2: READY 🐶', which is returned, and so by waiting for that value, the result will be this string. So we store that into 'x' and then we can log it to console.
    console.log(x);
    console.log("3: Done getting dog pics!");
  } catch (err) {
    //compulsory catch block in IIFE. in case there's an error, it will catch it and log it to the console here
    console.log("ERROR 💥");
  }
})(); //calling it right away. So you declare a function inside of parentheses and then call it right away. And so this way, you don't have to declare a whole name function again that you will have to then call at some point later.

// console.log("1: Will get dog pics!");
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log("3: Done getting dog pics!");
//   })
//   .catch((err) => {
//     console.log("ERROR 💥");
//   });

/* 

OUTPUT:

1: Will get dog pics!
I could not find that file 😢
ERROR 💥

==> So this still works with the aync/await IIFE.

*/
