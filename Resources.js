const FLAG = "🚩", BOMB = "💣", EMPTYSPACE = "&nbsp", DOUBT = "❓";
var defCol = "#EFB9B9";
const colorArray = ["black", "#11e5f0", "#e6e629", "#ebac7c", "#d97d14", "#eb6b57", "#e0420d", "#ed1515", "#960e0e"];


const buttonContainer = document.createElement("div");
buttonContainer.id = "buttonContainer";
var zeroState, gameActive, flagged, score = 0;
var BOMB_COUNT = 15, xLim = 10, yLim = 10, buttonSize = 80;
/**
 * DDA containing all the Mine objects at index corresponding to their position
 * its x and y indexes are reversed as it was causing problems with alignment of buttons 
 * when size was greater than 9
 * ie, mines[2][3] refers to a button of id 3,2
 */
var mines = new Array();
var timerID;

const clickResponse = function () {

    if (gameActive == false)
        return;
    if (zeroState)//means clicked for the first time
    {
        zeroState = false;
        //start timer
        timer.innerHTML = "Time elapsed: 00:00";
        timerID = setInterval(function () {
            seconds++;
            if (seconds == 60) {
                seconds = 0;
                minutes++;
                if (minutes == 60) {
                    minutes = 0;
                    hours++;
                }

            }
            refreshTimer();
        }, 1000);
        //assign bombs to buttons
        putBombsIn(mines, getMineOfButton(this));
        //now reveal some random group of mines, in vicinity of currently pressed button
        revealRandomMines(this, true);
    }
    else {
        revealRandomMines(this, false);
    }
    getMineOfButton(this).reveal();
    if (getMineOfButton(this).getHasBomb) {

        //reveal all bomb mines and show losing message
        mines.forEach(function (sda) {
            sda.forEach(function (e) {
                if (e.getHasBomb)
                    e.reveal();
            });
        });
        fireGameEnd(false);
        return;
    }

}


function increaseScore() {
    score++;
    //console.log("incScr to "+score);
    if (score == (xLim * yLim) - BOMB_COUNT)
        fireGameEnd(true);
}
function getMineAt(y, x) {
    if (isOutOfBounds(x, y)) {
        return null;
    }
    else
        return mines[x][y];
}
function putBombsIn(minesArray, except) {
    let i = -1, j = -1;
    let c = 0;
    while (c < BOMB_COUNT) {
        j = Number(Math.round(Math.random() * (xLim - 1)));
        i = Number(Math.round(Math.random() * (yLim - 1)));
        console.log(i, j);
        if (minesArray[i][j] === except)
            continue;
        if (minesArray[i][j].getHasBomb == false) {
            minesArray[i][j].setHasBomb = true;
            c++;
        }

    }
    //make all buttons calculate number of bomb buttons in their vicinity
    mines.forEach(row => {
        row.forEach(c => c.calculateBombs());
    });
}

const fireGameEnd = function (boolResult) {
    if (!boolResult) {
        scoreStatus.innerHTML = "🎆You WON!🎆";
        scoreStatus.style.color = "#1bbfb7";
        wincontent = true;
    }
    else {
        scoreStatus.innerHTML = "🤦🏻‍♂️You LOST!!🙄";
        scoreStatus.style.color = "#ad1a1a";
        wincontent = false;
    }
    gameActive = false;
    clearInterval(timerID);
    getOffset(canvas);
    
    showWinBox();
}
/**
 * To get absolute position of an element
 * @param {*} elem 
 * @returns 
 */
const getOffset=function(elem)
    {
        const r=elem.getBoundingClientRect();
        //console.log(r);
        //console.log(window.scrollX,window.scrollY);
        return{
            x: r.left+window.scrollX,
            y: r.top+window.scrollY
        };
    }

const getMineOfButton = function (button) {
    try {
        var str = button.id;
        let i = str.substring(0, str.indexOf(','));
        let j = button.id.charAt(str.indexOf(',') + 1);
        return mines[j][i];
    }
    catch (error) {
        return null;
    }
}
const revealRandomMines = function (currentMine, goFurther) {

    let p = getMineOfButton(currentMine);
    p.startRevealChain(goFurther);
}
function refreshStatusLabel() {
    scoreStatus.innerHTML = "Flagged: " + flagged;
}

function refreshTimer() {
    if (hours == 0) {
        timer.innerHTML = "Time elapsed: " + putZeroBefore(minutes) + ":" + putZeroBefore(seconds);
    }
    else {
        timer.innerHTML = "Time elapsed: " + putZeroBefore(hours) + ":" + putZeroBefore(minutes) + ":" + putZeroBefore(seconds);
    }
}
function putZeroBefore(numb) {
    return (numb < 10 ? '0' : '') + numb;
}

var stopCanvas = function () {
    var x = 1;

    var h = setInterval(function () {
        canvas.style.opacity = x;
        x -= 0.01;
        if (x < 0) {
            clearInterval(h);
            clearInterval(confettiMaker);
            reset.innerHTML = "Reset";
            permitted = false;
            try {
                buttonContainer.removeChild(canvas);
                buttonContainer.removeChild(reset);
                buttonContainer.removeChild(settingsButton);
                mines.forEach(function (sda) {
                    sda.forEach(function (e) {


                        buttonContainer.appendChild(e.face);
                    });
                });


                buttonContainer.appendChild(reset);
                buttonContainer.appendChild(settingsButton);

            }
            catch (Error) { }
        }
    }, 2);
}

/**
 *  a function to initialize all variables . the reset button will just call this function
 * so that reloading  the page is not needed to restart game
 */
const initializeGame = function () {
    zeroState = true;
    gameActive = true;
    flagged = 0;
    score = 0;
    permitted = false;
    reset.innerHTML = "Reset";
    mines.forEach(function (sda) {
        sda.forEach(function (e) {

            buttonContainer.appendChild(e.face);
            e.refresh();
        });
    });
    buttonContainer.appendChild(reset);
    buttonContainer.appendChild(settingsButton);
    seconds = 0, minutes = 0, hours = 0;
    timer.innerHTML = "Tap/Click on a tile to begin the game";
    scoreStatus.innerHTML = "Flagged:0";
    scoreStatus.style.color = "rgb(0,0,0)";
    clearInterval(timerID);
}
var resetter = function () {

    let x = 0;
    clearInterval(inst);
    clearInterval(confettiMaker);


    inst = setInterval(function () {
        buttonContainer.style.opacity = Math.pow(Math.cos(x), 2);
        x += Math.PI / 100;
        if (Math.abs(x - Math.PI) < 0.1) {
            buttonContainer.style.opacity = 1;
            clearInterval(inst);
        }
        if (Math.abs(x - Math.PI / 2) < 0.1) {
            try { buttonContainer.removeChild(canvas); }
            catch (error) { }

            initializeGame();
        }


    }, 20);


}
var confettiMaker;
function showWinBox() {
    canvas.style.opacity = 0.01;

    buttonContainer.removeChild(reset);
    buttonContainer.removeChild(settingsButton);
    buttonContainer.appendChild(canvas);
    buttonContainer.appendChild(reset);
    buttonContainer.appendChild(settingsButton);
    mines.forEach(sda => {
        sda.forEach(elem => {
            buttonContainer.removeChild(elem.face);
        });
    });

    let i = 0.01;
    let k = setInterval(function () {
        canvas.style.opacity = i;
        i += 0.01;
        if (i > 1) {
            clearInterval(k);
            if (wincontent == false)
                reset.innerHTML = "Flush🧻";
            permitted = true;
            window.requestAnimationFrame(painter);
            confettiMaker = setInterval(function () {

                for (var i = 0; i < numAtOnce; i++) {
                    coll.push(new FlyingEmojis(x++));
                    activeCount++;
                }
                param += 0.03;
            }, emojiSpawnInterval);
        }
    }, 4);

}
function changeTheme(newcol) {
    if (defCol == newcol)
        return;
    defCol = newcol;
    ret.style.background = "linear-gradient(150deg,#FFFFFF," + newcol + ",#000000)";
    dialog.style.background = "linear-gradient(150deg,#fff," + newcol + ")";
    document.querySelector('meta[name="theme-color"]').setAttribute('content', newcol);
    mines.forEach(function (mine) {
        mine.forEach(function (min) {
            min.setNewColorAs(newcol);
        });
    });
}