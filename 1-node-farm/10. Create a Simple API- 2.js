//* Create a simple API-2

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
    fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
      //Using 'dirname' variable for current directory. Using ES6 template string syntax.

      const productData = JSON.parse(data); //converting JSON into JS code.
      //console.log(productData);//restart server, refresh page, and productData will show up in the server's console.

      res.writeHead(200, {
        //code 200 means 'OKAY'
        "Content-type": "application/json", // describing content type as JSON.
      });
      res.end(data); //sending a response with 'data', which is a string. This function can't send an object, so we can't send 'productData'.
    });

    // res.end('This is the API!');
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

Restart the server, and refresh the page to api. You will see the data on the webpage.
*/
