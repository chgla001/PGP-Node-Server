var http = require('http'),
    express = require('express'),
    socketManager = require('./socket-manager');

const PORT = '4000',
    HOST = '127.0.0.1';

var app = express();

// app.use(app.router);
// app.use(express.static(__dirname + '/public'));

var server = http.createServer(app)
server.listen(PORT, HOST, function(err){
if (err) {
    console.log(err);
} else {
    console.log('Server is running on ' + HOST + ':' + PORT);
}
});
socketManager.listen(server);

// app.get('/', function (req, res) {
//     res.sendfile(__dirname + '/views/index.html');
// });