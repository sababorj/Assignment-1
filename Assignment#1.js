/*
 * Hello World API
 */

// Dependencies
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

// Create the server
const server = http.createServer((req,res) => {

    // Get data from request
    const Parseurl = url.parse(req.url,true);
    const path = Parseurl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    const queryObj = Parseurl.query;
    const method = req.method.toLowerCase();

    // Get payload
    const decoder = new stringDecoder('utf-8');
    let buffer = '';
    req.on('data', async(data) => {
        buffer += await decoder.write(data);
    });
    req.on('end', async() => {
        buffer += await decoder.end();
        // Gather the data
        data = await {
            'path' : trimmedPath,
            'queryString' : queryObj,
            'method' : method,
            'payload' : buffer
        };

        // Chose handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.notFound;

        // Rout request to handler
        chosenHandler(data, async(status,payload) => {
            status = await typeof(status) === 'number' ? status : 200;
            payload = await typeof(payload) === 'object' ? payload : {};
            const stringPayload = await JSON.stringify(payload);

            // Send respond
            res.setHeader('Contect-Type', 'application/json');
            res.writeHead(status);
            res.end(stringPayload);

            // log the respond
            console.log('Welcome to my API Server',status,stringPayload);
        });
    });
});

// Start the server
server.listen(2000, () => {
    console.log('Server runs on port 2000.');
});

// Define handler
const handler = {};
handler.notFound = (data, callback) => {
    callback(404);
};
handler.hello = (data, callback) => {
    callback(400, {'Response': 'Welcome'});
};

// Define router
const router = {
    'hello' : handler.hello
};