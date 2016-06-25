#!/usr/bin/env node
'use strict';

var http = require('http');

var port = process.env.PORT;

var server = http.createServer(function (request, response) {
    response.writeHead(200);
    response.end("Mr. Hammond, I think we're back in business!");
});

server.listen(port, function () {
    console.log('HTTP server listening at port ' + port);
});
