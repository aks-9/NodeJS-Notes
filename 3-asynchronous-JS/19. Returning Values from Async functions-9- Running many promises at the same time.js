//* RETURNING VALUES FROM ASYNC FUNCTIONS-8

//* Running many promises at the same time.

//So lets suppose that we actually wanted to get three random dog images and not just one. So simply awaiting 3 API calls, one after the other.

//But, why would we actually make the second API call wait for the first one, and the third one wait for the second one? That would just add unnecessary waiting time when we could just run all of these promises at the same time.

//what we will do is to not await a promise at this point, but instead save the promise into a variable. So again, we want to now save the promise and not the resolved value of the promise.

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

    //Did not use 'await'. Saving the promise into a variable, and not the resolved value of the promise.
    const res1Prom = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    ); //This one here returns a promise.

    //Duplicating
    const res2Prom = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    //Duplicating
    const res3Prom = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    //Now in order to actually get the resolved values, i.e. the three images, we create a new variable 'all', and now what we do await is Promise.all(). And into Promise.all(), we pass an array of promises.
    const all = await Promise.all([res1Prom, res2Prom, res3Prom]); //if we then await that Promise.all(), it will basically run these three promises all at the same time and then save all three resolved values into this 'all' array here.

    // console.log(all); //this 'all' will be an array.

    const images = all.map((element) => element.body.message); //So using 'map' method on 'all' array will loop through the 'all' array and save the value that we return in each iteration, into a new array called 'images'.  And the current value in each iteration is called 'element' and what we will return is element.body.message.
    console.log(images); //This will return 3 strings with image urls.

    writeFileProm("dog-img.txt", images.join("\n")); // Now joining the 3 strings by putting a new line character between them. So '\n' means a new line, okay. And so that basically will put these three strings, each one, in a new line
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
[
  'https://images.dog.ceo/breeds/labrador/n02099712_4403.jpg',
  'https://images.dog.ceo/breeds/labrador/n02099712_4965.jpg',
  'https://images.dog.ceo/breeds/labrador/n02099712_7866.jpg'
]
Random dog image saved to file!
2: READY 🐶
3: Done getting dog pics!


==> Now we should have 3 different images in 'dog-img.txt' file.

*/
