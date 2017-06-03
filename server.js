var moment = require ('moment');
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express(); //creating a new app variable,new call express as a function
//now we will create a server using node module instead of using express
var http = require('http').Server(app);
/*calling Server and pass app.this tells node to start a new server and
to use this express app.So anything the app listens to the server will also listen the same*/
var io = require('socket.io')(http); //calling http server directly
app.use(express.static(__dirname + '/public'));
var clientInfo = {};

//send current users
function sendCurrentUsers(socket){
  var info = clientInfo[socket.id];
  var users = [];
  if(typeof info === 'undefined'){
    return;
  }
  Object.keys(clientInfo).forEach(function(socketId){
    var userInfo=clientInfo[socketId];
    if(info.room === userInfo.room){
      users.push(userInfo.name);
    }
  });
  socket.emit('message', {
    name:'System',
    text: 'Current user: '+users.join(', '),
    timestamp:moment().valueOf()
  });
}


io.on('connection', function(socket) {
  console.log('user is connected');

  socket.on('disconnect',function(){
    var disconnect= clientInfo[socket.id];
    if(typeof disconnect !== 'undefined'){
      socket.leave(disconnect.room);
      io.to(disconnect.room).emit('message',{
        name:'System',
        text:disconnect.name +' has left!!',
        timestamp:moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

  socket.on('Join Room',function(req){
    clientInfo[socket.id]=req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message',{
      name:'System',
      text: req.name+' has joined',
      timestamp:moment().valueOf()
    });
    });

  socket.on('message', function(message) {
    message.timestamp=moment().valueOf();
    console.log('message recieved ' + message.text);
    if(message.text === '@currentUsers'){
      sendCurrentUsers(socket);
    }else {
      message.timestamp = moment().valueOf();
    io.to(clientInfo[socket.id].room).emit('message', message); //this will send message to every one including the sender
    //socket.broadcast.emit('message',message); //this is use to broadcast message sent to everyone except the sender
      }
  });

  socket.emit('message', {
    name:'System',
    text: 'Welcome to the chat application',
    timestamp:moment().valueOf()
  });
  /*now here except for 'Message' argument we get only one argument to use
     as a result we will use Object because the we can store all sorts of informations.
     So a message can have a diffent properties like timestamp,from attribute(storing text message)*/
}); //on:= is use to listen the event here "connection".it is use to emmit event

http.listen(PORT, function() {
  console.log('Server started');
}); //function() is a callback function when server starts
