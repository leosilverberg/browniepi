var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dir = require('node-dir');
var Gpio = require('onoff').Gpio;
var RaspiCam = require('raspicam');
var camera = new RaspiCam({
    mode: 'photo',
    output: 'public/photos/photo1.jpg',
    w:1000,
    h:1000,
    e:"jpg",
    q:100,
    ex: "sports",
    nopreview: true
});

var redLed = new Gpio(23, 'out');
var greenLed = new Gpio(24, 'out');
var yellowLed = new Gpio(25, 'out');
var button = new Gpio(17, 'in', 'both');
var buttonPrevVal = 0;
var busy = false;

app.get("/", function(req, res) {
    res.sendfile('public/index.html')
 });

 app.use(express.static('public'));

/////////////////DIR STUFF
 dir.files("public/photos", function(err, files) {
    if (err) throw err;
    console.log(files);
});

 ////////////////////SOCKET STUFF

 io.on('connection', function(socket){
    console.log('a user connected');

    dir.files("public/photos", function(err, files) {
        if (err) throw err;
        socket.emit("init",files);
    });

    socket.on("snap", function(){
        var timestamp = Date.now();
        camera.set("output", "public/photos/"+timestamp+".jpg");
        camera.start();
    });

});

/////////////////camera stuff
camera.on("read", function(err, timestamp, filename){
    if(err){
        console.log(err);
        return;
    }
    yellowOn();
    console.log("photo taken");
    io.emit("newphoto", filename);
    
    setTimeout(function(){
        greenOn();
        setTimeout(function(){
            allLedOff();
            busy = false;
        }, 700);
    }, 500);
});

function snapPhoto(){
    var timestamp = Date.now();
    camera.set("output", "public/photos/"+timestamp+".jpg");
    camera.start();
    redOn();
}
  


/////////////////////SERVING
 var port = process.env.PORT || 5000;
 http.listen(port, function() {
   console.log("Listening on " + port);
   bootLoop(500);
 });



 ////////////GPIO FUNCTIONS

 button.watch(function(err, value){
     if (err){
         console.log(err);
         return;
     };

     if(value == 1 && buttonPrevVal != value && busy == false){
         busy = true;
         snapPhoto();
     }
     
     buttonPrevVal = value;
 })

 function greenOn(){
    greenLed.writeSync(1);
 };

 function redOn(){
    redLed.writeSync(1);
 };

 function yellowOn(){
    yellowLed.writeSync(1);
 };

 function redOff(){
     redLed.writeSync(0);
 };

 function greenOff(){
     greenLed.writeSync(0);
 };

 function yellowOff(){
     yellowLed.writeSync(0);
 };

 function allLedOn(){
     greenOn();
     redOn();
     yellowOn();
 };

 function allLedOff(){
    greenOff();
    redOff();
    yellowOff();
};

 function bootLoop(time){
     var timer = time;
     redOn();
     setTimeout(function(){
         yellowOn();
         setTimeout(function(){
             greenOn();
             setTimeout(function(){
                allLedOff();
             }, timer);
         }, timer);
     }, timer);
 };