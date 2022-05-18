//CUSTOM MODULE -1
//This is 'index.js'

//Adding custom modules
/*

 We can actually create our own module and export something from them, like for example a function.Then import this function into another module and then use that function there.

 We will move the replaceTemplate function into a separate module, so that it could be used wherever it is imported. 
 
 In NodeJS every single file is treated as a module. 'fs', 'http', 'url' are also standard modules we have imported in this index.js file.

*/

//Create a new folder in the root project folder called 'modules'. Within 'modules' folder, create a new file called "replaceTemplate.js". Now cut the whole "replaceTemplate" function from this page and paste it to the new file. 

//Go to replaceTemplate.js


const fs = require('fs');
const http = require('http'); 
const url = require('url'); 

const tempOverview =  fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct =  fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard =  fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data =  fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


/// [ MOVED TO A SEPARATE MODULE replaceTemplate.js]

// const replaceTemplate = (template, product) => {
//     let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%ID%}/g, product.id);

//     if(!product.organic)
//     output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

//     return output;

// }


const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true); 
    
    //Overview page
    if(pathname === "/" || pathname === "/overview") {

        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map( element => replaceTemplate(tempCard, element)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS', cardsHtml);
        res.end(output);
    } 
    
    //Product page
    else if (pathname === "/product") {
        
        res.writeHead(200, {'Content-type': 'text/html'});

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);        
        res.end(output);
    } 
    
    //API page
    else if (pathname === "/api") {

        
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



  