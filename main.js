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
    //context.globalCompositeOperation='source-ove';
    //context.globalCompositeOperation = "multiply";
      imageObj.onload = function() {
        context.drawImage(imageObj, 69, 50);
     };
      imageObj.src = 'download.png';
      $scope.eraseParts = function(){
        context.strokeStyle = 'white';
        context.fillStyle = 'white';
        //context.globalCompositeOperation='source-over';
      }
    $scope.colorChange = function(color){
      context.strokeStyle = color;
      context.fillStyle = color;
    //  context.globalCompositeOperation='multiply';

    };
    $scope.radiusChange = function(size) {
      radius = size;
      context.lineWidth = radius*2;

    }
    context.lineWidth = radius*2;
    var putPoint = function (e) {
      if(drag){
        //context.globalCompositeOperation='multiply';
        context.lineTo(e.offsetX,e.offsetY)
        context.stroke();
        context.beginPath();
        //context.globalCompositeOperation='source-over';
        context.arc(e.offsetX,e.offsetY,radius,0,Math.PI*2);

        context.fill();
        //context.globalCompositeOperation='multiply';
        context.beginPath();
        context.moveTo(e.offsetX,e.offsetY);
        context.globalCompositeOperation='source-atop';

        context.drawImage(imageObj, 69, 50);
        context.globalCompositeOperation='source-over';
        //context.drawImage(imageObj, 69, 50);

      }
    }
    //var imageData = context.getImageData(0,0,canvas.width,canvas.height);
    //console.log(imageData);
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
