//driver code

var scoreStatus = document.createElement("h2");
var timer = document.createElement("h4");
var reset = document.createElement("button");
scoreStatus.id = "scoreStatus";
reset.id = "reset";
reset.innerHTML = "Reset";

buttonContainer.appendChild(scoreStatus);
buttonContainer.appendChild(timer);


buttonContainer.style.width = (xLim * 80 + 10) + "px";
buttonContainer.style.height = (yLim * 80 + 10) + "px";
document.body.appendChild(buttonContainer);

//create mine objects
for (let i = 0; i < xLim; i++) {
    let row = new Array();
    for (let j = 0; j < yLim; j++) {
        let b = new Mine(new Point(i, j), clickResponse);
        buttonContainer.appendChild(b.face);
        row.push(b);
    }
    mines.push(row);
}


var inst;
reset.addEventListener("click", resetter);
var x = 0;
var grad = setInterval(function () {
    if (gameActive == false)
        clearInterval(grad);
    let red = 93;
    let green = 170;
    let blue = Math.sin(x) * 100 + 127;
    x += 0.05;
    let color = "rgb(" + red + ',' + green + ',' + blue + ')';
    var bodyStyle = document.querySelector("body").style;
    bodyStyle.background = "linear-gradient(140deg,#FFFFFF," + color + ")";
    bodyStyle.backgroundRepeat = "no-repeat";
    bodyStyle.backgroundAttachment = "fixed";


}, 200);
var seconds = 0, minutes = 0, hours = 0;
let lab1 = document.createElement('h6');
lab1.innerHTML = "Background Color";
var dialog = document.createElement("dialog");
dialog.appendChild(lab1);

let cp = document.createElement("input");
cp.type = "color";
cp.value = "#156e8e";
dialog.appendChild(cp);

let ret = document.createElement("button");
ret.innerHTML = "Done";
ret.id = "return";
ret.style.background = "linear-gradient(150deg,#FFFFFF,#156e8e,#000000)";
dialog.appendChild(ret);
buttonContainer.appendChild(dialog);

var settingsButton = document.createElement("button");
settingsButton.innerHTML = "Settings";
settingsButton.id = "settings";

settingsButton.addEventListener("click", function () {
    dialog.showModal();
});

ret.addEventListener("click", function () {
    dialog.close();
    let newcol = cp.value;
    console.log(newcol);
    ret.style.background = "linear-gradient(150deg,#FFFFFF," + newcol + ",#000000)";
    document.querySelector('meta[name="theme-color"]').setAttribute('content', newcol);
    mines.forEach(function (mine) {
        mine.forEach(function (min) {
            min.setNewColorAs(newcol);

        });
    });
});

var canvas = document.createElement("canvas");
var ctxt = canvas.getContext('2d');
canvas.width = (xLim * 80);
canvas.height = (yLim * 80);

canvas.addEventListener("click", resetter);
initializeGame();