const FLAG="🚩",BOMB="💣",EMPTYSPACE="&nbsp",DOUBT="❓";
var defCol="#156e8e";
const colorArray=["black","#11e5f0","#e6e629","#ebac7c","#d97d14","#eb6b57","#e0420d","#ed1515","#960e0e"];


const buttonContainer=document.createElement("div");
buttonContainer.id="buttonContainer";
var zeroState,gameActive,flagged,score=0;
var BOMB_COUNT=0, xLim=9, yLim=9, buttonSize=80;
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
    //console.log("incScr to "+score);
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
var animScript;
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

    //add this inside if statement
     animScript=document.createElement("script");
        animScript.src="animation.js";
        document.body.appendChild(animScript);
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
 * so that reloading  the page is not needed to restart game
 */
 const initializeGame=function()
 {
     zeroState=true;
     gameActive=true;
     flagged=0;
     score=0;
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
 var resetter=function()
{
    
    let x=0;
    clearInterval(inst);
    inst=setInterval(function()
    {
        buttonContainer.style.opacity=Math.pow(Math.cos(x),2);
        x+=Math.PI/100;
        if(Math.abs(x-Math.PI)<0.1)
        {
            buttonContainer.style.opacity=1;
            clearInterval(inst);
        }
        if(Math.abs(x-Math.PI/2)<0.1)
        {
            initializeGame();
        }
        

    },20);
    document.body.removeChild(animScript);
    
}