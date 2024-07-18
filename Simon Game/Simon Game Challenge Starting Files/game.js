let buttonColors = ["red", "yellow", "blue", "green"];
let gamePattern = [];

$(".btn").click(function(){
    console.log(this);
    let color =  $(this).attr("id");

    nextSequence(color);
});

function nextSequence(color) {
    // let randomNumber = Math.floor(Math.random() * 3);
    // let color = buttonColors[randomNumber];

$("#" + color).fadeIn(100).fadeOut(100).fadeIn(100);
var audio = new Audio("sounds/" + color + ".mp3");
audio.play();
}

function playSound(color) {
    var audio = new Audio("sounds/" + color + ".mp3");
    audio.play();
}
//$(".btn").click(function(e){console.log(e)});