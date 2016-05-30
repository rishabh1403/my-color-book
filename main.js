(function(){
  var app = angular.module("myColorBook",[]);
  app.controller('mainCtrl',['$scope',function($scope){

    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    canvas.width="500";
    canvas.height="500";
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
  //  context.globalAlpha = 0.7;
    var radius = 10;
    var drag = false;
    var imageObj = new Image();
context.globalCompositeOperation = "multiply";
      imageObj.onload = function() {
        context.drawImage(imageObj, 69, 50);
      };
      imageObj.src = 'download.png';
    $scope.colorChange = function(color){
      context.strokeStyle = color;
      context.fillStyle = color;
    };
    $scope.radiusChange = function(size) {
      radius = size;
      context.lineWidth = radius*2;

    }
    context.lineWidth = radius*2;
    var putPoint = function (e) {
      if(drag){
        context.lineTo(e.offsetX,e.offsetY)
        context.stroke();
        context.beginPath();
        context.arc(e.offsetX,e.offsetY,radius,0,Math.PI*2);
        context.fill();
        context.beginPath();
        context.moveTo(e.offsetX,e.offsetY);
      }
    }
    var imageData = context.getImageData(0,0,canvas.width,canvas.height);
    console.log(imageData);
    var engage = function(e){
      drag = true;
      putPoint(e);
    }
    var disengage = function(){
      drag = false;
      context.beginPath();
    }
    canvas.addEventListener('mouseup',disengage);
    canvas.addEventListener('mouseleave',disengage);

    canvas.addEventListener('mousedown',engage);
    canvas.addEventListener('mousemove',putPoint);

  }]);


}());
