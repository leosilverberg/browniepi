var socket = io();

socket.on("init", function(msg){
    console.log(msg);
    msg.forEach(msg => {
        var split = msg.split("/");
        console.log(split);
        $("#photo-container").prepend("<div class='pure-u-1-1 photo-holder' style='margin-bottom:20px; box-shadow:0 3px 10px rgba(0,0,0,0.16)'> <img src='photos/"+split[2]+"'class='pure-img'/>");
    });
});

socket.on("newphoto", function(msg){
    $("#photo-container").prepend("<div class='pure-u-1-1 photo-holder' style='margin-bottom:20px; box-shadow:0 3px 6px rgba(0,0,0,0.16)'> <img src='photos/"+msg+"'class='pure-img'/>");
})

$('#snap-button').click(function(){
    socket.emit("snap");
});

///comon