
const gravity = 0.15;
const restitution = 0.8;
const numAtOnce = 5;
const emojiSpawnInterval=20;
var showerX=canvas.width/2, showerY=canvas.height/2;
var wincontent;
var food=["🍕","🍔","🧀","🍗"];
var insult=["🖕","💩"];
class FlyingEmojis {
    constructor() {
        this.vx = -5 + Math.random() * 10;
        this.vy = -5 + Math.random() * 10;
        this.x = showerX;
        this.y = showerY;
        this.hue = Math.random() * 360;
        this.saturation = Math.random() * 100;
        this.brightness = 50 + Math.random() * 50;        
        this.textSize = Math.random()*55+10;
        this.life=300;
        if(wincontent)
        this.content=food[parseInt(Math.random()*food.length)];
        else
        this.content=insult[parseInt(Math.random()*insult.length)];;
    }
    
    draw = function (g) {

        //g.fillStyle = "hsla(" + this.hue + "," + this.saturation + "%," + this.brightness + "%," + this.alpha + "%)";
        g.fillStyle="black";
        g.font=Math.trunc(this.textSize)+"px arial";
        g.fillText(this.content,this.x,this.y)
        this.x += this.vx;
        this.y += this.vy;
        
        let x=this.x;
        let y=this.y;
        
        if(x<-this.textSize||   x>canvas.width  ||  y<-this.textSize  ||  y>canvas.height)
        {
            coll.splice(this,1);
            
        }
        

        
        /* for gravity
        if(!wincontent)
        this.vy += gravity;
        */
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
    //console.log("repainting");
    if (permitted)
        window.requestAnimationFrame(painter);
    else {
        coll.length = 0;
    }
}



