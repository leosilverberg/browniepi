var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dir = require('node-dir');
var RaspiCam = require('raspicam');
var camera = new RaspiCam({
    mode: 'photo',
    output: 'public/photos/photo1.jpg',
    w:500,
    h:500,
    e:"jpg",
    q:100
});

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
    console.log("photo taken");
    io.emit("newphoto", filename);
})
  


/////////////////////SERVING
 var port = process.env.PORT || 5000;
 http.listen(port, function() {
   console.log("Listening on " + port);
 });