//* Routing-2

//This is 'index.js'

const fs = require("fs");
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const pathName = req.url; // saving into pathname.

  //Using if-else statments for deciding the response from a server.
  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the OVERVIEW!");
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT!");
  } else {
    res.writeHead(404, {
      //sending error status code in the console of the page. This method can also send 'Headers' in the second argument within an object. An HTTP header is a piece of information about the response we're sending back.

      "Content-type": "text/html", //standard header of content type.
      "my-own-header": "hello-world", //a custom header. Will be visible under Network tab in browser's console.
    });
    res.end("<h1>Page not found! </h1>"); //When page doesn't exist. We can use the html tag in the message as we've specified a content-type header in the res.writeHead(). Now the response will be in <h1> heading font. Headers can only be sent before sending a response.
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to new requests on port 8000");
});

/*
Routing has nothing to do with the files and folders in our project's file system.

*/
