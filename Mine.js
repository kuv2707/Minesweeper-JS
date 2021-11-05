var menter=function()
{
 
    if(gameActive==false)
    return;
    
    if(getMineOfButton(this).revealed==false)
    {
        
        this.style.background="linear-gradient(150deg,#FFFFFF,"+defCol+",#000000)";
        this.style.boxShadow="0px 0px 60px" + " rgb(154, 73, 228)";

    }
}
var mleave=function()
{
    this.style.background=getMineOfButton(this).mainAppearance;
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
        this.textOnReveal=EMPTYSPACE;
        this.mainAppearance="linear-gradient(150deg,#FFFFFF,"+defCol+")";
        this.face.style.background=this.mainAppearance;
        this.face.id=""+this.location.getX+","+this.location.getY;
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
    refresh()
    {
        
        this.hasBomb=false;
        this.revealed=false;
        this.textOnReveal=EMPTYSPACE;
        this.mainAppearance="linear-gradient(150deg,#FFFFFF,"+defCol+")";
        this.face.style.background=this.mainAppearance;
        this.face.innerHTML=EMPTYSPACE;
        //this.face.innerHTML=this.face.id;
        this.face.style.boxShadow="none";
    }
    setNewColorAs(newcol)
    {
        if(this.revealed==false)
        {
            this.mainAppearance="linear-gradient(150deg,#FFFFFF,"+newcol+")";
            this.face.style.background=this.mainAppearance;
        }
        
    }
    setTextOnReveal(text)
    {
        this.textOnReveal=text;
        if(isNaN(text)==false)
        {
            this.face.style.color=colorArray[Number(text)];
        }
        //nothing can be done on a mine after it has been revealed, except refreshing it
        
    }
    
    reveal=function()
    {
        if(this.revealed)
        return;
        this.revealed=true;
        if(this.face.innerHTML==FLAG)
        {
            flagged--;
            refreshStatusLabel();
        }
        this.face.innerHTML=this.textOnReveal;
        if(this.getHasBomb)
        this.mainAppearance="linear-gradient(150deg,#111111,#750a05)";
        else
        this.mainAppearance="linear-gradient(150deg,#555,#067022)";
        this.face.style.background=this.mainAppearance;
        if(this.getHasBomb==false)
        increaseScore();
        //console.log(this.face.id+"  is revealed");
    }
    startRevealChain=function(goFurther)
    {
        if(this.revealed)
        return;
        this.reveal();
        
        let arr=[0,-1,0,1,1,0,-1,0];
        for(let i=0;i<arr.length-1;i+=2)
        {
            let p=getMineAt(this.location.getX+arr[i],this.location.getY+arr[i+1]);
            
            if(p!=null)
            {
                if(p.getHasBomb==false)
                {
                    if(goFurther)
                    p.startRevealChain();
                    else
                    {
                        //reveal if it is not flagged
                        if(p.face.innerHTML!=FLAG)
                        {
                            p.reveal();
                        }
                    }
                    
                }
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
                
                if(mines[j][i].getHasBomb==true)
                c++;
            }
        }
        if(c!=0)
        {
            this.setTextOnReveal(""+c);
        }
        else{
            this.setTextOnReveal(EMPTYSPACE);
        }
        
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
               
    }
    
    else
    {
        if(getMineOfButton(this).revealed)
        return;
        flagged++;
        this.innerHTML=FLAG;
        
    }
    refreshStatusLabel();
}
var isOutOfBounds=function(x,y)
{
    return !(x>=0 &&  y<yLim  &&  x<xLim  &&  y>=0);
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
