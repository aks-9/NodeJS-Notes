//* Create a simple API-1

//An API is a service from which we can request some data.

//This is 'index.js'

const fs = require("fs");
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the OVERVIEW!");
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT!");
  } else if (pathName === "/api") {
    fs.readFile("./dev-data/data.json"); //Reading data from a json file. The '.' refers to the directory from which we run the node command in the terminal. All NodeJS scripts get access to a variable called 'dirname', and that variable always translates to the directory in which the script we're currently executing is located.

    res.end("This is the API!"); //adding API route.
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found! </h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to new requests on port 8000");
});

/*


*/
