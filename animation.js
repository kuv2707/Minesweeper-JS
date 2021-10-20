
const gravity = 0.15;
const restitution = 0.8;
const numAtOnce = 5;
var showerX, showerY;
var wincontent;
class Confetti {
    constructor(id) {
        this.vx = -5 + Math.random() * 10;
        this.vy = -8 + Math.random() * 10;
        this.x = showerX;
        this.y = showerY;
        this.id = id;
        this.hue = Math.random() * 360;
        this.saturation = Math.random() * 100;
        this.brightness = 50 + Math.random() * 50;
        this.alpha = 50 + Math.random() * 50;
        this.radius = 15;
    }
    draw = function (g) {

        g.fillStyle = "hsla(" + this.hue + "," + this.saturation + "%," + this.brightness + "%," + this.alpha + "%)";
        //g.fillRect(this.x,this.y,20,20);
        if(wincontent)
        {
            var path = new Path2D();
            path.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
            g.fill(path);
        }
        else
        {
            g.font=20+this.radius+"px arial";
            g.fillText("💩",this.x,this.y)
        }
        
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;

        if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
            //delete coll[this.id];
            //coll.shift();
            coll.splice(this, 1);


        }
    }
}
var x = 0;
var param = 0;
var coll = new Array();
var activeCount = 0;
var permitted=false;
var painter = function () {
    if(wincontent)
    ctxt.globalCompositeOperation = "source-over";
    ctxt.fillStyle = cp.value;
    ctxt.fillRect(0, 0, canvas.width, canvas.height);

    //draw balls
    if(wincontent)
    ctxt.globalCompositeOperation = "lighter";
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



