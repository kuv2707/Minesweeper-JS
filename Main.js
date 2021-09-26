const buttonContainer=document.createElement("div");
const allContainer=document.createElement("div");
allContainer.id="ALLCONTAINER";
buttonContainer.id="buttonContainer";
var zeroState=true;
var gameActive=true;
var flagged=0;
var score=0;
const BOMB_COUNT=10;
var mines=new Array();//DDA containing all the Mine objects at index corresponding to their position
const clickResponse=function()
{
    //console.log(this.id);
    if(gameActive==false)
    return;
    if(zeroState)//means clicked for the first time
    {
        zeroState=false;
        //assign bombs to buttons
        putBombsIn(mines,getMineOfButton(this));
        //now reveal some random group of mines, in vicinity of currently pressed button
        revealRandomMines(this);
        
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
    if(score==BOMB_COUNT)
    {
        fireGameEnd(true);
    }
}
var putBombsIn=function(minesArray,except)
{
    let c=0;
    while(c<BOMB_COUNT)
    {
        let i=Math.round(Math.random()*7);
        let j=Math.round(Math.random()*7);
        if(minesArray[i][j]===except)
        continue;
        if(minesArray[i][j].getHasBomb==false)
        {
            minesArray[i][j].setHasBomb=true;
            c++;
        }

    }
    console.log("put the bombs!");
    //make all buttons calculate number of bomb buttons in their vicinity
    mines.forEach(row =>
        {
            row.forEach(c => c.calculateBombs());
        });
}
var updateStatusAndJudge=function(isRealBombMine)
{
    
    if(isRealBombMine)
    score++;
    scoreStatus.innerHTML="Flagged: "+flagged;
    if(score==BOMB_COUNT)
    {
        fireGameEnd(true);
    }
}
const fireGameEnd=function(boolResult)
{
    if(boolResult)
    {
        scoreStatus.innerHTML="WON!🎆";
    }
    else
    {
        scoreStatus.innerHTML="LOST!!!🤦🏻‍♂️";
        
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
        return null;
    }
}
const revealRandomMines=function(currentMine)
{
    
    let p=getMineOfButton(currentMine);
        p.startRevealChain();
}
//driver code
var scoreStatus=document.createElement("h2");
scoreStatus.id="scoreStatus";
allContainer.appendChild(scoreStatus);
scoreStatus.innerHTML="Flagged:0";
allContainer.appendChild(buttonContainer);
document.body.appendChild(allContainer);
for(let i=0;i<8;i++)
{
    let row=new Array();
    for(let j=0;j<8;j++)
    {
        let b=new Mine(new Point(i,j),clickResponse);
        buttonContainer.appendChild(b.face);
        row.push(b);
    }
    mines.push(row);

    //document.write("<br>");
}
console.log(scoreStatus.innerHTML);