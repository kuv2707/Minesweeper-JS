var canvas=document.createElement("canvas");
    var ctxt=canvas.getContext('2d');
    canvas.width=600;
    canvas.height=500;
    var dial=document.createElement("dialog");
    dial.append(canvas);
buttonContainer.append(dial);

var ty=document.createElement("button");
ty.id="return";
ty.innerHTML="Wow!";
ty.addEventListener("click",async function()
{
    for(var i=1;i>0;i-=0.001)
    {
        dial.style.opacity=i;
    }
    dial.close();
    resetter();
});
dial.append(ty);
dial.showModal();

const gravity=0.15;
const restitution=0.8;
const numAtOnce=5;
var showerX,showerY;
class Confetti
{
    constructor(id)
    {
        this.vx=-5+Math.random()*10;
        this.vy=-8+Math.random()*10;
        this.x=showerX;
        this.y=showerY;
        this.id=id;
        this.hue=Math.random()*360;
        this.saturation=Math.random()*100;
        this.brightness=50+Math.random()*50;
        this.alpha=50+Math.random()*50;
        this.radius=20;
    }
    draw=function(g)
    {
        
        g.fillStyle="hsla("+this.hue+","+this.saturation+"%,"+this.brightness+"%,"+this.alpha+"%)";
        //g.fillRect(this.x,this.y,20,20);
        var path=new Path2D();
        path.arc(this.x,this.y,this.radius,2*Math.PI,false);
        g.fill(path);
        this.x+=this.vx;
        this.y+=this.vy;
        this.vy+=gravity;
                
        if(this.y>canvas.height  ||  this.x<0  ||  this.x>canvas.width)
        {
            delete coll[this.id];
            
        }
    }
}
var x=0;
var param=0;
var coll=new Array();
var activeCount=0;
var painter=function()
{
    ctxt.globalCompositeOperation="source-over";
    ctxt.fillStyle="rgb(0,0,0)";
    ctxt.fillRect(0,0,canvas.width,canvas.height);

    //draw balls
    ctxt.globalCompositeOperation="lighter";
    coll.forEach(function(v)
    {
        v.draw(ctxt);
    });
    
    window.requestAnimationFrame(painter);
}

window.requestAnimationFrame(painter);
setInterval(function()
{
    
    for(var i=0;i<numAtOnce;i++)
    {
        coll.push(new Confetti(x++));
        activeCount++;
    }
    //showerX=canvas.width/2+(canvas.width/3)*Math.sin(param);
    showerX=canvas.width/2;
    showerY=190;
    param+=0.03;
},10);

