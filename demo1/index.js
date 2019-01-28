
/*
* Main file 
* @Author: Sanjeet Kumar
*
*/

const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const config = require('./config');


//  http Server
const httpServer = http.createServer((req, res) => {
    commonServer(req, res);
});

// Listining Http Server
httpServer.listen(config.httpPort, () => console.log(`server is listing at ${config.httpPort} in ${config.env_name} mode`));

var keysobj = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem'),
}

//  https Server
const httpsServer = https.createServer(keysobj, (req, res) => {
    commonServer(req, res);
});
// Listining Http Server
httpsServer.listen(config.httpsPort, () => console.log(`server is listing at ${config.httpsPort} in ${config.env_name} mode`));



const handler = {}

handler.ping = (data, callback) => {
    callback(200);
}

handler.notFound = (data, callback) => {
    callback(404, {})
}

const router = {
    ping: handler.ping
}

var commonServer = function(req, res) {
    // Parse the url to get multiple options
    var parsedUrl = url.parse(req.url, true);

    // remove the slashes
    var trimPath = parsedUrl.pathname.replace(/^\/+|\/+$/g,'') 

    //  To decode the string
    const decoder = new StringDecoder('utf-8');
    var buffer = ''

    // On Data getting
    req.on('data', (data) => {
        buffer += decoder.write(data);
    })

    // finally when the responce is ready
    req.on('end', () => {
        buffer += decoder.end();

        var getRouter = typeof router[trimPath] !== 'undefined' ? router[trimPath] : handler.notFound
        
        var data = {
            path: trimPath,
            headers: req.headers,
            queryString: parsedUrl.query,
            method: req.method,
            payload: buffer
        }
        
        getRouter(data, (statusCode, payload) => {
            // double check status
            statusCode  = typeof statusCode === 'number' ? statusCode : 200

            // check payload
            payload = typeof payload === 'object' ? payload : {}

            // Parsed to json
            var payloadString = JSON.stringify(payload);
            
            // Returning the responce 
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString + '\n');
        });
        
    });
  
}