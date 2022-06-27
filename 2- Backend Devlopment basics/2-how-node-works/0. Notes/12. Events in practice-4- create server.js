//Events in practice-3

//create a small web server, and then actually listen to the event that it emits

const EventEmitter = require("events");
const http = require("http"); //Importing HTTP module.

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: Jonas");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit("newSale", 9);

//--------------------------------------------------------------------------------

const server = http.createServer(); // creating a server.

//Listening to the 'request' event.
server.on("request", (req, res) => {
  console.log("Request received!");
  console.log(req.url);
  res.end("Request received");
});

//Multiple listeners
server.on("request", (req, res) => {
  console.log("Another request 😀");
});

server.on("close", () => {
  console.log("Server closed");
});

//starting the server
server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});

/*
RUN node events.js 

OUTPUT:

There was a new sale!
Customer name: Jonas
There are now 9 items left in stock.
Waiting for requests...


=> So, we see "Waiting for request..."", and the application is not shutting down, and now we know it's not shutting down because the event loop is still waiting for incoming I/O.


So now if we go to http://127.0.0.1:8000/, we will see:

There was a new sale!
Customer name: Jonas
There are now 9 items left in stock.
Waiting for requests...
Request received!
Another request 😀



=> In this case, of course, we have to emit the events ourself, but if we're using a built in node module, then these functions in there will many times emit their own events, and all we have to do is to listen to them. 

 */
