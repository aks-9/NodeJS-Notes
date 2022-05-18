//Create a simple API-3

//Refactoring.

//This is 'index.js'

const fs = require('fs');
const http = require('http'); 
const url = require('url'); 

//TOP LEVEL code.
//Declaring reading here will result into only reading the file once, instead of reading it again and again for every request. This will be synchronous.
const data =  fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //Using readFileSync here as this is synchronous.
const dataObj = JSON.parse(data);    



const server = http.createServer((req, res) => {

    const pathName = req.url;

    if(pathName === "/" || pathName === "/overview") {
        res.end('This is the OVERVIEW!');
    } else if (pathName === "/product") {
        res.end('This is the PRODUCT!');
    } else if (pathName === "/api") {

        //No need to read the data here, it is already read in the top level.
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data); //Sending data from TOP LEVEL code.        
        
        
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        }); 
        res.end("<h1>Page not found! </h1>");    
    }


});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to new requests on port 8000");
}); 


/*


*/
  