var socket = io();

socket.on("init", function(msg){
    console.log(msg);
    msg.forEach(msg => {
        var split = msg.split("/");
        console.log(split);
        $("#photo-container").append("<div class='pure-u-1-1 photo'> <img src='photos/"+split[2]+"'class='pure-img'/>");
    });
});

socket.on("newphoto", function(msg){
    $("#photo-container").append("<div class='pure-u-1-1 photo'> <img src='photos/"+msg+"'class='pure-img'/>");
})

$('#snap-button').click(function(){
    socket.emit("snap");
});
