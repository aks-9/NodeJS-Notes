//Streams in practice-1

//Create a new file "streams.js" in the root project directory.

//If we need to read a large text file from the file system, and then send it to the client, we can use streams.

const fs = require("fs"); //importing
const server = require("http").createServer(); //importing 'http' and creating a server simultaneously.

//Solution 1: Simply reading and sending a response. Listening to event 'request' and specifying our callback.
server.on("request", (req, res) => {
  fs.readFile("test-file.txt", (err, data) => {
    if (err) console.log(err);
    res.end(data);
  });
});

//Starting the server:
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});

/*

Run node streams.js 

The server will start listening

go to http://127.0.0.1:8000/


So this file is huge, it has "Node.js is the best" written in it like 10000 times, and so it takes a lot of time until it loads entirely. And we're not really interested in loading everything, so lets stop this here. 

So the solution 1 works just fine, but the problem is that with this solution, node will actually have to load the entire file into memory, because only after that's ready, it can then send that data.

Now this is a problem when the file is big, and also when there are a ton of requests hitting your server. Because the node process will very quickly run out of resources and our app will quit working, everything will crash. 

So this solution 1 does work when we're just creating something small locally. But in a production, you cannot use a piece of code like this. So lets move on to our second solution. And in that solution, we will actually use streams.

*/
