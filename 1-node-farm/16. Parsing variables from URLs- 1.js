//Parsing variables from URLs- 1

//This is 'index.js'

const fs = require('fs');
const http = require('http'); 
const url = require('url'); 

const tempOverview =  fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct =  fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard =  fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data =  fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;

}


const server = http.createServer((req, res) => {

    console.log(req.url);// this will print "/product?id=0"
    console.log(url.parse(req.url, true)); //Parse is used to parse the varibles out of the url. We need to pass "true" as a second argument into this parse function, in order to actually parse the 'query' into an object. And by query we mean "id=0" part in a url like this: "http://127.0.0.1:8000/product?id=0".
    const pathName = req.url;

    /* 

    Restart the server and go to the page http://127.0.0.1:8000/product?id=0 . You will see the following print in the terminal:

/product?id=0      ///This is from req.url
Url {              ///This is the result of url.parse()
  protocol: null,
  slashes: null, 
  auth: null,    
  host: null,    
  port: null,    
  hostname: null,
  hash: null,
  search: '?id=0',
  query: [Object: null prototype] { id: '0' },     ///This query object tells us that id is 0.
  pathname: '/product',                            ///This shows the pathname.
  path: '/product?id=0',
  href: '/product?id=0'
}
    
    */

    //Overview page
    if(pathName === "/" || pathName === "/overview") {

        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map( element => replaceTemplate(tempCard, element)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS', cardsHtml);
        res.end(output);
    } 
    
    //Product page
    else if (pathName === "/product") {
        res.end('This is the PRODUCT!');
    } 
    
    //API page
    else if (pathName === "/api") {

        
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);         
        
        
    } 
    
    //Not Found page 
    else {
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
  