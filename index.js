const http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser');

const socketManager = require('./socket-manager'),
    login = require('./routes/login-route'),
    messages = require('./routes/messages-route');

const PORT = '4000',
    HOST = '192.168.2.116'; //IP has to be updated when starting the server

var app = express();
// middleware
app.use(bodyParser.json());

//routes
app.use('/login', login);
app.use('/messages', messages);

var server = http.createServer(app)
server.listen(PORT, HOST, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Server is running on ' + HOST + ':' + PORT);
    }
});