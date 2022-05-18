//* Callback Hell Problem-4

//adding an error handler

const fs = require("fs");
const superagent = require("superagent");

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message); //Error handling, eg. in case of wrong breed name.
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        if (err) return console.log(err.message); //in case of error while saving to file.
        console.log("Random dog image saved to file!");
      });
    });
});

/* 
Run: npm start

OUTPUT:
Breed: labrador
https://images.dog.ceo/breeds/labrador/n02099712_5021.jpg
Random dog image saved to file!

=> We did end up using call backs inside of call backs inside of call backs. And sometimes it can go even deeper than what we have here. You could have like 10 levels inside of each other. Now all these call backs, it makes code difficult to understand and hard to maintain. Again maybe not at this level with just three call backs inside of each other. But if we had it even deeper nested, it could quickly become a nightmare to maintain code like this. And that's why this pattern has been called a 'callback hell'. It's easy to identify this triangular shape in our code.

So we're gonna learn how to use something called 'Promises'. And that will then in the end solve our problem and make our code easier to read and to maintain.

*/
