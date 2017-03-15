#!/usr/bin/env node

const app = require('./app');
const config = require('config');
const http = require('http');
const port = config.get('port');

app.set('port', port);

const server = http.createServer(app);

server.listen(port);

console.info(`Running server on port ${port}`);
