const express = require('express');
const app = express();
const path = require('path')
const passport = require("./utils/googlelogin");
const session = require('express-session')
const bodyParser = require('body-parser');
const socket = require("socket.io");
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header('Access-Control-Allow-Headers','application/json');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: '24khbkhb6k24hjb626',
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.use('/user', require(path.join(__dirname, 'routes/user_auth')));
app.use(require(path.join(__dirname, 'utils/tokenmiddleware')))
app.use('/dashboard', require(path.join(__dirname, 'routes/dashboard.js')));
var server = app.listen(process.env.PORT || 5460, (err) => {
    if (err) {
        throw err;
    } else {
        console.log("server started!!");
    }
})
onlinerooms = [];
chatusersRooms = [];
var io = socket(server);
io.sockets.on('connection', function (socket) {
    socket.on('registerNewuser', function (data) {
        socket.join(data.roomId);
        if (onlinerooms.indexOf(data.roomId) == -1) {
            onlinerooms.push(data.roomId);
        }
        io.sockets.emit('registerNewuserDone', { socketId: data.roomId });
    });
    socket.on('checkonline', function (data) {
        ids = data.data;
        arr = []
        for (i = 0; i < ids.length; i++) {
            obj = {}
            id = ids[i];
            if ((onlinerooms.indexOf(id)) != -1) {
                obj.id = id;
                obj.online = true;
                arr.push(obj);
            } else {
                obj.id = id;
                obj.online = false;
                arr.push(obj);
            }
        }
        io.sockets.emit('checkonlinereturn', { arr: arr });
    });
    socket.on('logout', function (data) {
        index = onlinerooms.indexOf(data.roomId)
        onlinerooms.splice(index, 1);
        socket.leave(data.roomId);
    })
    socket.on('registerchatuser', function (data) {
        socket.username = data.username;
        socket.room = data.data;
        if (chatusersRooms.indexOf(data.data) == -1) {
            chatusersRooms.push(data.data)
        }
        socket.join(data.data);
    });
    socket.on('leaveuser', function () {
        socket.leave(socket.room);
    });
    socket.on('typing', function (data) {
        if (data.type) {
            io.sockets.in(socket.room).emit('typinguser', { type: true, userid: socket.username });
        }
        else {
            io.sockets.in(socket.room).emit('typinguser', { type: false, userid: socket.username });
        }
    });
    socket.on('sendchat', function (data) {
        data = data.data;
        const chatcrud = require(path.join(__dirname, "db/helpers/chatCrud"));
        chatcrud.updatechats(data)
        io.sockets.in(socket.room).emit('updatechat', data);
    });
});