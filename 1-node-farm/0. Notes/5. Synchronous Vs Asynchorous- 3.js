//* Synchronus (Blocking) vs Asynchronus (Non-Blocking)-3

//Callback Hell

//This is 'index.js'

const fs = require("fs");

//Asynchronous code (Non-Blocking)
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  //reading the start.txt file, which has a text that contains the name of another text file.
  if (err) return console.log("ERROR!"); //handling error in case the file doesn't exist. Change the name of the file to test it.
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    //using ES6 to pass the data1
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      //reading the text of append.txt
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2} \n${data3}`, "utf-8", (err) => {
        //writing text in 'data2' and ''data3' to a file final.txt. Only one argument in callback as no data is being read.
        console.log("Your file has been written!");
      });
    });
  });
});
console.log("Will read file!");
