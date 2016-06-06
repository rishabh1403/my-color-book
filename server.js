var express = require('express');
var app = express();
var cors = require('cors');
// app.use(cors({
//     origin: 'http://localhost:8000/',
//     credentials: true
// }));
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var sid = [];
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

//io.set('origins', 'http://localhost:8000');
io.on("connection",function(socket){
sid.push(socket.id);
socket.join('room1');
  console.log("a new client connection");
  socket.on("disconnect",function(){
    console.log("a client disconnected");
  });

  socket.on("message",function (data) {
    console.log(data);
    var replyData = "this is very good";
    console.log(sid);
    io.to('room1').emit("message",replyData);
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
