var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.on("connection",function(socket){
  console.log("a new client connection");
  socket.on("disconnect",function(){
    console.log("a client disconnected");
  });

  socket.on("message",function (data) {
    console.log(data);
    var replyData = "this is very good";
    io.emit("message",replyData);
  });

  socket.on("engage",function(data){
    io.emit("engage",data);
  });

  socket.on("putPoint",function(data){
    io.emit("putPoint",data);
  })

    socket.on("disengage",function(data){
      io.emit("disengage",data);
    })

    socket.on("colorChange",function(data){
      io.emit("colorChange",data);
    })
    socket.on("radiusChange",function(data){
      io.emit("radiusChange",data);
    })
})

server.listen(3000,function () {
  console.log("listening on port 3000");
});
