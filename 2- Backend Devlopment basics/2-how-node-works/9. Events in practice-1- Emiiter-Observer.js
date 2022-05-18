//Events in practice-1

//create a new file in project's root directory and name it "events.js"

const EventEmitter = require("events"); //Importing events module.
const myEmitter = new EventEmitter(); //To create a new "emitter", creating a new instance of EventEmitter class.

//Setting up a listener. Using 'on' method on our instance for an event named "newSale".
myEmitter.on("newSale", () => {
  //Observer. This observes the "emitter"
  console.log("There was a new sale!"); //This line will be executed when "newSale" event is emitted.
});

//Another listener for "newSale" event. We can set up multiple listeners for the same event.
myEmitter.on("newSale", () => {
  //Observer
  console.log("Customer name: Jonas"); //This line will be executed when "newSale" event is emitted.
});

myEmitter.emit("newSale"); //Using our emitter instance to emit an event named "newSale".

/**
 * 
 *RUN node events.js 
 * 
 * OUTPUT:
 * 
 * There was a new sale!
Customer name: Jonas
 */
