const express = require('express');
const app = express();

const http = require('http').Server(app),
    bodyParser = require('body-parser'),
    cors = require('cors');

const login = require('./routes/login-route'),
    messages = require('./routes/messages-route');

const PORT = 4000;

// middleware
app.use(bodyParser.json());
app.use(cors());

//routes
app.use('/login', login);
app.use('/messages', messages);

http.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`);
});