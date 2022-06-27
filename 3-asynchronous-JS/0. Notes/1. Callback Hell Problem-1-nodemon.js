//* Callback Hell Problem-1

//create a new file index.js in the root directory of the project.

//we're going to use 'dog.text' file in the root directory of the project. And from there we will read the breed name of the dog. And then we are gonna do an HTTP request to get a random image of a dog of a given breed using the DOG API. And then save that random image to another text file. So it's a three step process and all of this will involve call back functions.

/*We are going to use an API from DOG.CEO: 
https://dog.ceo/api/breed/hound/images/random 

So all we will have to do is to create an HTTP request to this URL and then it will get us back an image. 
*/

const fs = require("fs");

//asynchronous version of fs.readfile.
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);
});

/* Install nodemon first:
npm install nodemon --save-dev

Then go to package.json and edit the script field:

"scripts": {
    "start": "nodemon index.js"
  }


  Now start the nodemon by running:
  
  npm start 


*/
