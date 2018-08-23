var socketio = require('socket.io'),
    database = require('./database'),
    io,
    // maps socket.id to user's nickname
    nicknames = {},
    // list of socket ids
    clients = [],
    namesUsed = [];

exports.listen = function (express) {
    console.log('socket io loaded');
    io = socketio.listen(express);
    io.set('log level', 2);
    io.sockets.on('connection', function (socket) {
        console.log('a user connected');
        // initializeConnection(socket);
        // handleChoosingNicknames(socket);
        handleClientDisconnections(socket);
        // handleMessageBroadcasting(socket);
        // handlePrivateMessaging(socket);
        handleRegister(socket);
        socket.on("message", function (text) {
            socket.emit("message", text);
        })
    });
}

function initializeConnection(socket) {
    showActiveUsers(socket);
    showOldMsgs(socket);
}

function showActiveUsers(socket) {
    var activeNames = [];
    var usersInRoom = io.sockets.clients();
    for (var index in usersInRoom) {
        var userSocketId = usersInRoom[index].id;
        if (userSocketId !== socket.id && nicknames[userSocketId]) {
            var name = nicknames[userSocketId];
            activeNames.push({
                id: namesUsed.indexOf(name),
                nick: name
            });
        }
    }
    socket.emit('names', activeNames);
}

function showOldMsgs(socket) {
    database.getOldMsgs(5, function (err, docs) {
        socket.emit('load old msgs', docs);
    });
}

function handleChoosingNicknames(socket) {
    socket.on('choose nickname', function (nick, cb) {
        if (namesUsed.indexOf(nick) !== -1) {
            cb('That name is already taken!  Please choose another one.');
            return;
        }
        var ind = namesUsed.push(nick) - 1;
        clients[ind] = socket;
        nicknames[socket.id] = nick;
        cb(null);
        io.sockets.emit('new user', {
            id: ind,
            nick: nick
        });
    });
}

function handleMessageBroadcasting(socket) {
    socket.on('message', function (msg) {
        var nick = nicknames[socket.id];
        database.saveMsg({
            nick: nick,
            msg: msg
        }, function (err) {
            if (err) throw err;
            io.sockets.emit('message', {
                nick: nick,
                msg: msg
            });
        });
    });
}

function handlePrivateMessaging(socket) {
    socket.on('private message', function (data) {
        var from = nicknames[socket.id];
        clients[data.userToPM].emit('private message', {
            from: from,
            msg: data.msg
        });
    });
}

function handleClientDisconnections(socket) {
    socket.on('disconnect', function () {
        var ind = namesUsed.indexOf(nicknames[socket.id]);
        delete namesUsed[ind];
        delete clients[ind];
        delete nicknames[socket.id];
        io.sockets.emit('user disconnect', ind);
    });
}

function handleRegister(socket) {
    socket.on('register', function (registerobject, callback) {
        console.log("Methodcall: handleRegister");
        console.log(registerobject);
        database.createUser(registerobject)
            .then(function () {
                callback("success");
            })
            .catch(function (err) {
                callback("error");
            });

    });
}