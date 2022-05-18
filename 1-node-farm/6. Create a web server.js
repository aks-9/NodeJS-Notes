//Create web server

//This is 'index.js'

const fs = require('fs');
const http = require('http'); // Module for using http connection.

const server = http.createServer((req, res) => {//using createServer method on http, and will accept a callback function, which will be fired off each time a new request hits our server. 'req' variable and 'res' variable are the two arguments.

    console.log(req);//logging the req object in the console.

    res.end('Hello from the server!');//sending a response back to the client.
});

server.listen(8000, '127.0.0.1', () => {//calling listen method on 'server' for listening to new incoming requests. It has three arguments: port number, localhost, and an arrow function.
    console.log("The server has been started! Listening to new requests on port 8000");
}); 

//run node index.js
// The server will now keep running in the terminal. You can visit the server in the browser by typing '127.0.0.1:8000' in a browser's address bar.  