
const gravity = 0.15;
const restitution = 0.8;
var numAtOnce = 5;
const emojiSpawnInterval=20;
var showerX=canvas.width/2, showerY=canvas.height/2;
var wincontent;
var food=["🍕","🍔","🧀","🍗"];
var insult=["🖕","💩"];
class FlyingEmojis {
    constructor() {
        this.make();
    }
    make=function()
    {
        this.velocity = 3+ Math.random() * 4;
        this.angle = Math.random() * 2*Math.PI;
        this.velocityX=this.velocity*Math.cos(this.angle);
        this.velocityY=this.velocity*Math.sin(this.angle);
        this.x = showerX;
        this.y = showerY;
        this.markForRemoval=false;        
        this.textSize = Math.random()*55+10;
        if(wincontent)
        this.content=food[parseInt(Math.random()*food.length)];
        else
        this.content=insult[parseInt(Math.random()*insult.length)];

    }
    draw = function (g) {

        //g.fillStyle = "hsla(" + this.hue + "," + this.saturation + "%," + this.brightness + "%," + this.alpha + "%)";
        g.fillStyle="black";
        g.font=Math.trunc(this.textSize)+"px arial";
        g.fillText(this.content,this.x,this.y)
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        let x=this.x;
        let y=this.y;
        
        if(x<-this.textSize||   x>canvas.width  ||  y<0  ||  y>canvas.height+this.textSize)
        {
            this.markForRemoval=true;
            
            
            
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
        if(!v.markForRemoval)
        v.draw(ctxt);
    });
    
    if (permitted)
        window.requestAnimationFrame(painter);
    else {
        coll.length = 0;
    }
}
var start=function()
{
    confettiMaker = setInterval(function ()
            {

                for (var i = 0; i < numAtOnce; i++) {
                    
                    //if(coll.length>720)
                    //break;
                    coll.push(new FlyingEmojis(x++));
                    //activeCount++;
                }
                
                param += 0.03;
            }, emojiSpawnInterval);
            confettiManager=setInterval(function()
            {
                var k=0;
                while(k<coll.length)
                {
                    if(coll[k].markForRemoval)
                    coll.splice(coll[k],1);
                    k++;
                }
            },2000);
}


