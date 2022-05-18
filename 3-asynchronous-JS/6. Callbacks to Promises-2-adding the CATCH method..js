//* Callbacks to Promises-2

//adding the 'catch' method.

const fs = require("fs");
const superagent = require("superagent");

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  //The 'then' method actually only handles fulfilled promises but it doesn't do anything if there was an error, because for that, we actually have another method. And that is the 'catch' method. So right after the 'then' method, we can chain another method which is called 'catch'.

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      // if (err) return console.log(err.message); //? Moved to 'catch' method below.
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log("Random dog image saved to file!");
      });
    })
    .catch((err) => {
      //for handling the error.
      console.log(err.message);
    });
});

/* 
Run: npm start

mispell the dog breed name and it should still work.

OUTPUT:
Breed: labradorrrrr
Not Found
 

*/
