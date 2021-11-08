
const gravity = 0.15;
const restitution = 0.8;
const numAtOnce = 5;
var showerX=canvas.width/2, showerY=190;
var wincontent;
var food=["🍕","🍔","🧀","🍳"];
class FlyingEmojis {
    constructor(id) {
        this.vx = -5 + Math.random() * 10;
        this.vy = -8 + Math.random() * 10;
        this.x = showerX;
        this.y = showerY;
        this.id = id;
        this.hue = Math.random() * 360;
        this.saturation = Math.random() * 100;
        this.brightness = 50 + Math.random() * 50;        
        this.textSize = Math.random()*55+10;
        if(wincontent)
        this.content=food[parseInt(Math.random()*food.length)];
        else
        this.content="💩";
    }
    draw = function (g) {

        g.fillStyle = "hsla(" + this.hue + "," + this.saturation + "%," + this.brightness + "%," + this.alpha + "%)";
        g.font=Math.trunc(this.textSize)+"px arial";
        g.fillText(this.content,this.x,this.y)
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
        if (this.y > canvas.height+60 || this.x < -50 || this.x > canvas.width+60) {
            
            coll.splice(this, 1);
            //console.log(coll.length);
        }
    }
}
var x = 0;
var param = 0;
var coll = new Array();
var activeCount = 0;
var permitted=false;
var painter = function () {
    ctxt.fillStyle = cp.value;
    ctxt.fillRect(0, 0, canvas.width, canvas.height);

    //draw balls
    coll.forEach(function (v) {
        v.draw(ctxt);
    });
    //<show a message of whether won or lost...>
    console.log("repainting");
    if (permitted)
        window.requestAnimationFrame(painter);
    else {
        coll.length = 0;
    }
}



