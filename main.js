(function(){
  var app = angular.module("myColorBook",[]);
  app.controller('mainCtrl',['$scope',function($scope){

    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    canvas.width="500";
    canvas.height="500";
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    var radius = 10;
    var drag = false;
    $scope.colorChange = function(color){
      context.strokeStyle = color;
      context.fillStyle = color;
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
    var engage = function(e){
      drag = true;
      putPoint(e);
    }
    var disengage = function(){
      drag = false;
      context.beginPath();
    }
    canvas.addEventListener('mouseup',disengage);
    canvas.addEventListener('mousedown',engage);
    canvas.addEventListener('mousemove',putPoint);

  }]);


}());
