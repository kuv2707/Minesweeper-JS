const buttonContainer=document.createElement("div");
const allContainer=document.createElement("div");
allContainer.id="ALLCONTAINER";
buttonContainer.id="buttonContainer";
var zeroState,gameActive,flagged,score;
const BOMB_COUNT=15, xLim=9, yLim=9, buttonSize=80;
/**
 * DDA containing all the Mine objects at index corresponding to their position
 */
var mines=new Array();
var timerID;
const clickResponse=function()
{
    
    if(gameActive==false)
    return;
    if(zeroState)//means clicked for the first time
    {
        zeroState=false;
        //start timer
        timer.innerHTML="Time elapsed: 00:00";
        timerID=setInterval(function()
        {
            seconds++;
            if(seconds==60)
            {
                seconds=0;
                minutes++;
                if(minutes==60)
                {
                    minutes=0;
                    hours++;
                }

            }
            refreshTimer();
        },1000);
        //assign bombs to buttons
        putBombsIn(mines,getMineOfButton(this));
        //now reveal some random group of mines, in vicinity of currently pressed button
        revealRandomMines(this,true);        
    }
    else
    {
        revealRandomMines(this,false);
    }
    getMineOfButton(this).reveal();
    if(getMineOfButton(this).getHasBomb)
    {
        
        //reveal all bomb mines and show losing message
        mines.forEach(function(sda)
        {
            sda.forEach(function(e)
            {
                if(e.getHasBomb)
                e.reveal();
            });
        });
        fireGameEnd(false);
        return;
    }
    
}
function increaseScore()
{
    score++;
    if(score==(xLim*yLim)-BOMB_COUNT)
    fireGameEnd(true);
}
function getMineAt(x,y)
{
    if(isOutOfBounds(x,y))
    {
        return null;
    }
    else
    return mines[x][y];
}
function putBombsIn(minesArray,except)
{
    let i=-1,j=-1;
    let c=0;
    while(c<BOMB_COUNT)
    {
         i=Number(Math.round(Math.random()*(xLim-1)));
         j=Number(Math.round(Math.random()*(yLim-1)));
        
        if(minesArray[i][j]===except)
        continue;
        if(minesArray[i][j].getHasBomb==false)
        {
            minesArray[i][j].setHasBomb=true;
            c++;
        }

    }
    //make all buttons calculate number of bomb buttons in their vicinity
    mines.forEach(row =>
    {
        row.forEach(c => c.calculateBombs());
    });
}
const fireGameEnd=function(boolResult)
{
    if(boolResult)
    {
        scoreStatus.innerHTML="🎆You WON!🎆";
        scoreStatus.style.color="rgb(15, 92, 50)";
    }
    else
    {
        scoreStatus.innerHTML="🤦🏻‍♂️You LOST!!🙄";
        scoreStatus.style.color="rgb(143, 9, 47)";
    }
    gameActive=false;
    clearInterval(timerID);
}
const getMineOfButton=function(button)
{
    try
    {
        let i=button.id.charAt(0);
        let j=button.id.charAt(1);
        return mines[i][j];
    }
    catch(error)
    {
        return null;
    }
}
const revealRandomMines=function(currentMine,goFurther)
{
    
    let p=getMineOfButton(currentMine);
    p.startRevealChain(goFurther);
}
function refreshStatusLabel()
{
    scoreStatus.innerHTML="Flagged: "+flagged;
}

var scoreStatus=document.createElement("h2");
var timer=document.createElement("h4");
var reset=document.createElement("button");
scoreStatus.id="scoreStatus";
reset.id="reset";
reset.innerHTML="Reset";

allContainer.appendChild(scoreStatus);
allContainer.appendChild(timer);
allContainer.appendChild(buttonContainer);
allContainer.appendChild(reset);
buttonContainer.style.width=(xLim*80+10)+"px";
buttonContainer.style.height=(yLim*80+10)+"px";
document.body.appendChild(allContainer);

//create mine objects
for(let i=0;i<xLim;i++)
{
    let row=new Array();
    for(let j=0;j<yLim;j++)
    {
        let b=new Mine(new Point(i,j),clickResponse);
        buttonContainer.appendChild(b.face);
        row.push(b);
    }
    mines.push(row);
}
reset.addEventListener("click",function()
{
    initializeGame();
});
var x=0;
setInterval(function()
{
    let red=93;
    let green=170;
    let blue=Math.sin(x)*100+127;
    x+=0.05;
    let color="rgb("+red+','+green+','+blue+')';
    var bodyStyle=document.querySelector("body").style;
    bodyStyle.background="linear-gradient(140deg,#FFFFFF,"+color+")";
    bodyStyle.backgroundRepeat="no-repeat";
    bodyStyle.backgroundAttachment="fixed";
},200);
var seconds=0,minutes=0,hours=0;
function refreshTimer()
{
    if(hours==0)
    {
        timer.innerHTML="Time elapsed: "+putZeroBefore(minutes)+":"+putZeroBefore(seconds);
    }
    else
    {
        timer.innerHTML="Time elapsed: "+putZeroBefore(hours)+":"+putZeroBefore(minutes)+":"+putZeroBefore(seconds);
    }
}
function putZeroBefore(numb)
{
    return (numb<10?'0':'')+numb;
}
/**
 *  a function to initialize all variables . the reset button will just call this function
 * so that reloading page is not needed to restart game
 */
const initializeGame=function()
{
    zeroState=true;
    gameActive=true;
    flagged=0;
    mines.forEach(function(sda)
    {
        sda.forEach(function(e)
        {
            e.refresh();
        });
    });
    seconds=0,minutes=0,hours=0;
    timer.innerHTML="Tap/Click on a tile to begin the game";
    scoreStatus.innerHTML="Flagged:0";
    scoreStatus.style.color="rgb(0,0,0)";
    clearInterval(timerID);
}
initializeGame();
const colChang=function()
{

}