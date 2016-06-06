(function(){
  var app = angular.module("myColorBook",['btford.socket-io']);
  app.factory('Socket', function (socketFactory) {
  var myIoSocket = io.connect('http://172.16.1.31:3000');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});
  app.controller('mainCtrl',['$scope','Socket',function($scope,Socket){

    var data = "this is good";
    Socket.on("connect",function(){
      Socket.emit("message",data);
        alert(this.id);
    });
    Socket.on("message",function (data) {
      alert(data);
    })

    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    canvas.width="600";
    canvas.height="500";
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
  //context.globalAlpha = 0.7;
    var radius = 10;
    var mouse = {x:0,y:0};
    var drag = false;
    var imageObj = new Image();
    //context.globalCompositeOperation='source-ove';
    //context.globalCompositeOperation = "multiply";
      imageObj.onload = function() {
        context.drawImage(imageObj, 20, 20);
     };
      imageObj.src = 'rhino4.png';
      // $scope.eraseParts = function(){
      //   context.strokeStyle = 'white';
      //   context.fillStyle = 'white';
      //   //context.globalCompositeOperation='source-over';
      // }
    $scope.colorChange = function(color){
      Socket.emit("colorChange",color);

    //  context.globalCompositeOperation='multiply';

    };
    Socket.on("colorChange",function (color) {
      context.strokeStyle = color;
      context.fillStyle = color;
    })
    $scope.radiusChange = function(size) {
      Socket.emit("radiusChange",size);


    }
    Socket.on("radiusChange",function (size) {
      radius = size;
      context.lineWidth = radius*2;
    })
    context.lineWidth = radius*2;
    var putPoint = function (mouse) {
      //console.log(drag," drag",e.offsetX);
      if(drag){
        //context.globalCompositeOperation='multiply';
        context.lineTo(mouse.x,mouse.y)
        context.stroke();
        context.beginPath();
        //context.globalCompositeOperation='source-over';
        context.arc(mouse.x,mouse.y,radius,0,Math.PI*2);

        context.fill();
        //context.globalCompositeOperation='multiply';
        context.beginPath();
        context.moveTo(mouse.x,mouse.y);
        context.globalCompositeOperation='source-atop';

        context.drawImage(imageObj, 20, 20);
        context.globalCompositeOperation='source-over';
        //context.drawImage(imageObj, 69, 50);

      }
    }
    //var imageData = context.getImageData(0,0,canvas.width,canvas.height);
    //console.log(imageData);


    Socket.on("putPoint",function (mouse) {
      //console.log("putting");
      putPoint(mouse);
    });
    var engage = function(mouse){
      console.log("in engage",mouse);
      drag = true;
      putPoint(mouse);
    }
    var disengage = function(){
      drag = false;
      context.beginPath();
    }
    var socketPutPoint = function(e){
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
      //console.log(mouse);
      Socket.emit("putPoint",mouse);
      //putPoint(e);

    }
    Socket.on("engage",function (mouse) {

      console.log("engaging");
      engage(mouse);
    });
    var socketEngage = function (e) {
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
      console.log(mouse);
      Socket.emit("engage",mouse);

    }
    var socketDisengage = function (e) {
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
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
