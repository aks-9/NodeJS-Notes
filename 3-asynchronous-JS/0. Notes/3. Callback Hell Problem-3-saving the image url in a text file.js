//Callback Hell Problem-3

//saving the image url in a text file.

const fs = require("fs");
const superagent = require("superagent");

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        //writing the image url to dog-img.txt
        console.log("Random dog image saved to file!");
      });
    });
});

/* 
Run: npm start

OUTPUT:

Breed: husky
https://images.dog.ceo/breeds/husky/n02110185_8397.jpg
Random dog image saved to file!

=> A file mentioned in the fs.writeFile() will be automatically created and image url will be saved in it.

*/
