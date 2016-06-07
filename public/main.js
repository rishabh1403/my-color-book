(function(){
  var app = angular.module("myColorBook",['btford.socket-io']);
  app.factory('Socket', function (socketFactory) {
  var myIoSocket = io.connect('http://172.16.1.31:3000');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});
  app.controller('mainCtrl',['$scope','Socket','$timeout',function($scope,Socket,$timeout){
     $scope.msg = [];
     $scope.statusMessage = "Chat Window";
     var audioin = new Audio('in.mp3');
     var audioout = new Audio('out.mp3');
     $scope.chatMessage = "";
    var data = {};
    $scope.sid = undefined;
    Socket.on("connect",function(){
        $scope.sid = this.id;
        data = {
            id : $scope.sid,
            msg : "A new client connected"

        }
      Socket.emit("message",data);
        //alert(this.id);
    });
    Socket.on("message",function (data) {
        if(data.id === $scope.sid){
            //audioin.play();
        }
        else {
            audioin.play();
        }
      $scope.msg.push(data);
    })
    $scope.sendMessage = function () {
        //audioout.play();
        data = {
            id : $scope.sid,
            msg : $scope.chatMessage
        }
        Socket.emit("message",data);
        $scope.chatMessage = "";
    }

    ///////////
    var typing = false;
    var typeLength = 2000;
    $scope.updateTyping = function () {
        if(!typing){
            typing = true;
            Socket.emit("typing",{id:$scope.sid});
        }

        lastTime = (new Date()).getTime();
        $timeout(function () {
            diff = (new Date()).getTime() - lastTime;
            if(diff>2000 && typing){
                typing = false;
                Socket.emit("stop typing",{id:$scope.sid});
            }
        }, 2000);
    }
    Socket.on("typing",function (data) {
        $scope.statusMessage = "your friend is typiing";
    });
    Socket.on("stop typing",function (data) {
        $scope.statusMessage = "chat window";
    });

    ///////
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    canvas.width="600";
    canvas.height="500";
    var radius = 10;
    var mouse = {x:0,y:0};
    var drag = false;
    var color = 'black';
    var dataToSend = {};
    var imageObj = new Image();
      imageObj.onload = function() {
        context.drawImage(imageObj, 20, 20);
     };
      imageObj.src = 'rhino4.png';
    $scope.colorChange = function(newcolor){
        color=newcolor;
    };
    $scope.radiusChange = function(size) {
        radius = size;
    }
    var putPoint = function (mousex,mousey,color,size) {
      if(drag){
          context.strokeStyle = color;
          context.fillStyle = color;
          context.lineWidth = size*2;
          //if (mouse.lastx && mouse.lasty) context.moveTo(mouse.lastx,mouse.lasty);
         context.lineTo(mousex,mousey)
         context.stroke();
         context.beginPath();
         context.arc(mousex,mousey,size,0,Math.PI*2);
         context.fill();
         context.beginPath();
        context.moveTo(mousex,mousey);
        context.globalCompositeOperation='source-atop';
        context.drawImage(imageObj, 20, 20);
        context.globalCompositeOperation='source-over';
      }
    }
    Socket.on("putPoint",function (dataToSend) {
      putPoint(dataToSend.mousex,dataToSend.mousey,dataToSend.color,dataToSend.radius);
    });
    var engage = function(dataToSend){
      console.log("in engage",mouse);
      drag = true;
      putPoint(dataToSend.mousex,dataToSend.mousey,dataToSend.color,dataToSend.radius);
    }
    var disengage = function(){
      drag = false;
      context.beginPath();
    }
    var socketPutPoint = function(e){
        mouse.last_x = mouse.x; mouse.last_y = mouse.y;
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
      dataToSend={
          mousex:mouse.x,
          mousey:mouse.y,
          color:color,
          radius:radius
      }
      Socket.emit("putPoint",dataToSend);
    }
    Socket.on("engage",function (dataToSend) {
      console.log("engaging");
      engage(dataToSend);
    });
    var socketEngage = function (e) {
        mouse.lastx = e.offsetX;
        mouse.lasty = e.offsetY;
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
      console.log(mouse);
      dataToSend={
          mousex:mouse.x,
          mousey:mouse.y,
          color:color,
          radius:radius
      }
      Socket.emit("engage",dataToSend);
    }
    var socketDisengage = function (e) {
    //   mouse.x = e.offsetX;
    //   mouse.y = e.offsetY;
      console.log(mouse);
      Socket.emit("disengage",mouse);
    }
    Socket.on("disengage",function (mouse) {
      disengage();
    })
    canvas.addEventListener('mouseup',socketDisengage);
    canvas.addEventListener('mouseleave',socketDisengage);
    canvas.addEventListener('mousedown',socketEngage);
    canvas.addEventListener('mousemove',socketPutPoint);

  }]);


}());
