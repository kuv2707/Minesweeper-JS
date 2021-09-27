const FLAG="🚩",BOMB="💣",EMPTYSPACE="&nbsp";
var menter=function()
{
    //console.log("changg"); 
    if(gameActive==false)
    return;
    if(getMineOfButton(this).revealed==false)
    {
        
        this.style.background="linear-gradient(150deg,#FFFFFF,#D6EAF8,#000000)";
        this.style.boxShadow="0px 0px 40px" + " rgb(154, 73, 228)";

    }
}
var mleave=function()
{
    this.style.background="linear-gradient(150deg,#FFFFFF,"+getMineOfButton(this).mainColor+",#000000)";
    this.style.boxShadow="none";
}
class Mine
{
    constructor(location,clickResponse)
    {
        this.location=location;
        this.face=document.createElement("button");
        this.hasBomb=false;
        this.revealed=false;
        this.textOnReveal="";
        this.mainColor="#41d0e9";
        this.face.id=""+this.location.getX+location.getY;
        this.face.className="Mines";
        this.face.innerHTML=EMPTYSPACE;
        this.face.addEventListener('click',clickResponse);
        this.face.addEventListener('mousedown',pressed);
        this.face.addEventListener('mouseup',released);
        this.face.addEventListener('mouseenter',menter);
        this.face.addEventListener('mouseleave',mleave);
        this.face.addEventListener('mousemove',released);//moving is same as releasing
        this.face.addEventListener('contextmenu',flag);
        
    }
    
    setTextOnReveal(text)
    {
        this.textOnReveal=text;
        //nothing can be done on a mine after it has been revealed
        
    }
    
    reveal=function()
    {
        this.face.innerHTML=this.textOnReveal;
        this.mainColor="#48C9B0";
        this.face.style.background="linear-gradient(#FFFFFF,"+this.mainColor+",#000000)";
        
        this.revealed=true;
        
    }
    startRevealChain=function(goFurther)
    {
        if(this.revealed)
        return;
        this.reveal();
        //console.log(this.face.id+"  is revealed");
        let p=mines[this.location.getX][this.location.getY-1];
        if(p!=null)
        {
            if(p.getHasBomb==false)
            {
                if(goFurther)
                p.startRevealChain();
                else
                p.reveal();
            }
        }
        p=mines[this.location.getX][this.location.getY+1];
        if(p!=null)
        {
            if(p.getHasBomb==false)
            {
                if(goFurther)
                p.startRevealChain();
                else
                p.reveal();
            }
        }
        p=mines[this.location.getX+1][this.location.getY];
        if(p!=null)
        {
            if(p.getHasBomb==false)
            {
                if(goFurther)
                p.startRevealChain();
                else
                p.reveal();
            }
        }
        p=mines[this.location.getX-1][this.location.getY];
        if(p!=null)
        {
            if(p.getHasBomb==false)
            {
                if(goFurther)
                p.startRevealChain();
                else
                p.reveal();
            }
            
        }
    }
    calculateBombs()
    {
        if(this.getHasBomb)
        return;
        let c=0;
        for(let i=this.location.x-1;i<=this.location.x+1;i++)
        {
            for(let j=this.location.y-1;j<=this.location.y+1;j++)
            {
                if(isOutOfBounds(i,j))
                {
                    
                    continue;
                }
                
                if(mines[i][j].getHasBomb==true)
                c++;
            }
        }
        this.setTextOnReveal(""+c);
    }
    set setHasBomb(b)
    {
        this.hasBomb=b;
        if(b==true)
        {
            this.textOnReveal=BOMB;
        }
        else{
            this.textOnReveal=EMPTYSPACE;
        }
    }
    get getHasBomb()
    {
        return this.hasBomb;
    }
}
var pressed=function()
{
    
    if(this.revealed==false)
    this.style.background="linear-gradient(#666666,#5DADE2,#000000)";//not this.face as this is the HTMLbutton object not my defined button class object
}
var released=function()
{
    if(this.revealed==false)
    this.style.background="linear-gradient(#FFFFFF,#41d0e9,#000000)";
}
var flag=function(e)
{
    e.preventDefault();
    if(gameActive==false)
    return;
    
    if(zeroState)
    return;  //no flagging before game begins
    
    if(this.innerHTML==FLAG)
    {
        this.innerHTML=EMPTYSPACE;
        flagged--;
        if(getMineOfButton(this).getHasBomb)
        score--;
        
    }
    else
    {
        if(getMineOfButton(this).revealed)
        return;
        flagged++;
        this.innerHTML=FLAG;
    }
    
    
    updateStatusAndJudge(getMineOfButton(this).getHasBomb);
        
    
    
}
var isOutOfBounds=function(x,y)
{
    let dec= (x>=0 &&  y<=7  &&  x<=7  &&  y>=0);
    //console.log(x,y,dec);
    return !dec;
}



class Point
{
    constructor(x,y)
    {
        this.x=x;
        this.y=y;
    }
    get getX()
    {
        return this.x;
    }
    get getY()
    {
        return this.y;
    }

}