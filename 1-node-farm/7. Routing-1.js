//Routing-1

//This is 'index.js'

const fs = require('fs');
const http = require('http'); 
const url = require('url'); //module to analyze the url.

const server = http.createServer((req, res) => {

    console.log(req.url); //logging the url on the req object. Refersh the webpage after restarting the server.
    res.end('Hello from the server!');
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to new requests on port 8000");
}); 


/*
The console will show the following urls as output:

Listening to new requests on port 8000
/
/favicon.ico


We have two urls here that means, we have two requests and the callback function was executed twice. 'favicon.ico' is generated when we're using a browser, the browser automatically performs a request for the website's favicon. In this case we can ignore it as we don't have any favicon. 


If you visit http://127.0.0.1:8000/overview

it will be printed in the console as:
/overview
/favicon.ico


Similarly If you visit http://127.0.0.1:8000/overview?i d=123&abc=456

overview?id=123&abc=456
/favicon.ico


The url module helps us to parse these "?id=123&abc=456" parameters and their values into a nicely formatted object.

*/
  