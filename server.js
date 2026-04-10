const path = require('path'); 
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatmessage = require('./utils/messages');
const {userjoin, getcurrentuser, userleave, getroomusers}= require('./utils/users');




const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));


const botname = "chatcord bot";


//run when client connects
io.on('connection', socket => {

    socket.on('joinroom', ({username, room}) => {
    const user = userjoin(socket.id, username, room);



    socket.join(user.room);
        

    //welcome current user
    socket.emit('message', formatmessage(botname,'welcome to ChatCord'));


    // broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatmessage(botname, `${user.username} has joined`));

    });

    //listen for chatmessage 
    socket.on('chatmessage', msg => {
        const user = getcurrentuser(socket.id)

       io.to(user.room).emit('message', formatmessage(user.username, msg));
    });



    //run when client disconnet
    socket.on('disconnect', () => {
        const user = userleave(socket.id)

        if(user) {
        io.emit('message',formatmessage(botname, `${user.username} has left the chat`));
        }
    });


});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
