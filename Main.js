const buttonContainer=document.createElement("div");
const allContainer=document.createElement("div");
allContainer.id="ALLCONTAINER";
buttonContainer.id="buttonContainer";
var zeroState=true;
var gameActive=true;
var flagged=0;
var score=0;
const BOMB_COUNT=10;
const xLim=8;
const yLim=8;
const buttonSize=80;
var mines=new Array();//DDA containing all the Mine objects at index corresponding to their position
const clickResponse=function()
{
    
    if(gameActive==false)
    return;
    if(zeroState)//means clicked for the first time
    {
        zeroState=false;
        //assign bombs to buttons
        putBombsIn(mines,getMineOfButton(this));
        //now reveal some random group of mines, in vicinity of currently pressed button
        revealRandomMines(this,true);
        
    }
    else
    {
        revealRandomMines(this,false);
    }
    
    if(getMineOfButton(this).getHasBomb)
    {
        
        //reveal all bomb mines
        mines.forEach(function(sda)
        {
            sda.forEach(function(e)
            {
                if(e.getHasBomb)
                e.reveal();
            });
        });
        fireGameEnd(false);
    }
    getMineOfButton(this).reveal();
    if(score==(xLim*yLim)-BOMB_COUNT)
    fireGameEnd(true);
}
var putBombsIn=function(minesArray,except)
{
    let i=-1,j=-1;
    try
    {
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
    }
    catch(error)
    {
        
    }
    console.log("put the bombs!");
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
    }
    else
    {
        scoreStatus.innerHTML="You LOST!!🤦🏻‍♂️";
        
    }
    
    gameActive=false;
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
        console.log(button);
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
//driver code
var scoreStatus=document.createElement("h2");
scoreStatus.id="scoreStatus";
allContainer.appendChild(scoreStatus);
scoreStatus.innerHTML="Flagged:0";
allContainer.appendChild(buttonContainer);
buttonContainer.style.width=(xLim*80+10)+"px";
buttonContainer.style.height=(yLim*80+10)+"px";
document.body.appendChild(allContainer);
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

    //document.write("<br>");
}
var reset=document.createElement("button");
reset.id="reset";
reset.innerHTML="Reset";
allContainer.appendChild(reset);
reset.addEventListener("click",function()
{
    location.reload();
});