//* Callback Hell Problem-2

//* creating an http request.

//This is index.js

// Make sure to install superagent npm package, by running:
// npm i superagent

const fs = require("fs");
const superagent = require("superagent"); //This module will be used to create an HTTP request.

//asynchronous version of fs.readfile.
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`) //chaining 'get' method on superagent.
    .end((err, res) => {
      // Now to get the data, we actually will also have to use the 'end' method on this.
      console.log(res.body.message); //So the data that we get is in the response variable. And then on that response variable is the property 'body'.In the 'message' property of the returned object, we will have the image.
    });
});

/* 
Run: npm start

Output:

Breed: retriever
{
  message: 'https://images.dog.ceo/breeds/retriever-curly/n02099429_3396.jpg',
  status: 'success'
}

In the 'message' property of the returned object, we have the image.

NOTE: nodemon is only responding to changes to index.js

*/
