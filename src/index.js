const express = require('express');
const http = require('http');
const cors = require('cors');

const dbInitializer = require('./startup/db_initializr');


const app = express();
process.env.NODE_ENV = app.get('env');
app.use(cors());



let server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } }); //Initialize websocket
socketController.initialize(io);

dbInitializer.initialize();


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => LOGGER.info(`Listening on port ${PORT} in ${app.get('env')} environment`));

module.exports = server;
