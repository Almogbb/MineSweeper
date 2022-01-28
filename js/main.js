'use strict'

const MINE = '💣';
const FLAG = '🚩'
const EMPTY = '';

var gElbtn = document.querySelector('.face');
var gBoard;
var gInterval;
var gMilliSec;
var gSec;
var gMin;
var gLives;
var gIsFirstClick;
var gRandomMine;

var gLevel = {
    size: 4,
    mine: 2
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0
};

function initGame() {
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard);
    gMilliSec = 0;
    gSec = 0;
    gMin = 0;
    stopWatch();
    gLives = 3;
    gIsFirstClick = true;
}

function buildBoard(length) {
    var board = []
    for (var i = 0; i < length; i++) {
        board[i] = []
        for (var j = 0; j < length; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
            board[i][j] = cell;
        }
    }

    board[0][0].isMine = true;
    board[1][1].isMine = true;


    // var mineCount = 0;
    // while (mineCount < gLevel.mine) {
    //     var firstI = getRandomInt(0, board.length - 1);
    //     var firstJ = getRandomInt(0, board.length - 1);

    //     if (!board[firstI][firstJ].isMine) {
    //         board[firstI][firstJ].isMine = true;
    //         mineCount++;
    //     }
    // }

    return board
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {

            strHTML += `<td class="cell cover" data-i="${i}" data-j="${j}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})">`

            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    var elBox = document.querySelector('.box');
    elBox.innerHTML = strHTML;
}

function setMinesNegsCount(cellI, cellJ, board) {
    var negsMinesCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            var cell = board[i][j];
            if (cell.isMine) negsMinesCount++;
        }
    }
    return negsMinesCount;
}

function cellClicked(elCell, i, j) {

    var currCell = gBoard[i][j];
    if (!gGame.isOn) return;
    if (currCell.isShown) return
    // if (currCell.isShown && !currCell.isMine) return;
    if (currCell.isMarked) return;

    currCell.minesAroundCount = setMinesNegsCount(i, j, gBoard);

    if (gIsFirstClick) {
        gInterval = setInterval(stopWatch, 10);
        gIsFirstClick = false;
    }

    if (!currCell.isMine) {
        elCell.classList.remove('cover');
        currCell.isShown = true;
        gGame.shownCount++;
        elCell.classList.add('clicked');
        if (currCell.minesAroundCount) elCell.innerText = currCell.minesAroundCount;
    }

    if (currCell.isMine) {
        currCell.isShown = true;
        lives();
        elCell.classList.remove('cover');
        elCell.classList.add('clicked');
        gGame.shownCount++;
        elCell.innerText = MINE;

        if (gLives <= 0) gameOver(elCell)
    }

    if (!currCell.minesAroundCount && !currCell.isMine) expendNegs(i, j, gBoard);

    console.log(currCell);
    checkVictory()
}

function lives() {
    var elLives = document.querySelector('.lives');
    gLives--;
    elLives.innerText = `${gLives} Lives Left!`;
}

function victory() {

    gGame.isOn = false;
    gElbtn.innerText = '😎'
    clearInterval(gInterval)
    gInterval = null
}

function gameOver(elCurrCell) {
    gGame.isOn = false;
    gElbtn.innerText = '😵';
    clearInterval(gInterval)
    gInterval = null

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            if (gBoard[i][j].isMine && !gBoard.isShown) {
                elCell.classList.remove('cover');
                elCell.innerText = MINE;
                elCurrCell.style.backgroundColor = 'red';
            }
        }
    }

}

function restart() {
    gElbtn.innerText = '😃'
    gGame.isOn = true;
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    clearInterval(gInterval)
    gInterval = 0;

    initGame();
    var elLives = document.querySelector('.lives');
    elLives.innerText = `${gLives} Lives Left!`;
}

function cellMarked(elCell, i, j) {
    window.event.preventDefault();
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    // var currCellAroundMines = setMinesNegsCount(i, j, gBoard);
    // console.log(currCellAroundMines);

    if (gIsFirstClick) {
        gInterval = setInterval(stopWatch, 10);
        gIsFirstClick = false;
    }

    if (elCell.classList.contains("clicked")) return;
    if (currCell.isMarked) {
        currCell.isMarked = false;
        elCell.innerText = EMPTY;
        gGame.markedCount--;
    } else {
        elCell.innerText = FLAG;
        currCell.isMarked = true;
        gGame.markedCount++;
    }

    console.log(currCell);

    checkVictory();
}

function expendNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = board[i][j];

            currCell.minesAroundCount = setMinesNegsCount(i, j, board);
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);

            if (currCell.minesAroundCount) {
                elCell.innerText = currCell.minesAroundCount;
                currCell.isShown = true;
                elCell.classList.remove('cover');
                elCell.classList.add('clicked');
            }
            else if (!currCell.minesAroundCount) {
                // board[i][j].innerText = EMPTY;
                currCell.isShown = true;
                gGame.shownCount++;
                elCell.classList.remove('cover');
                elCell.classList.add('clicked');
            }
            console.log(currCell);
        }

    }
}

function stopWatch() {
    var elClock = document.querySelector('.clock');
    if (gGame.shownCount > 0 || gGame.markedCount > 0) {

        gMilliSec++;
        if (gMilliSec === 100) {
            gMilliSec = 0;
            gSec++;
        }
        if (gSec === 60) {
            gMin++;
            gSec = 0;
        }
        elClock.innerText = `${gMin < 10 ? '0' + gMin : gMin}:${gSec < 10 ? '0' + gSec : gSec}:${gMilliSec < 10 ? '0' + gMilliSec : gMilliSec}`;
    } else {
        elClock.innerText = '00:00:00'
    }
}

function changeLevel(boardSize, minesAmount) {
    gLevel.size = boardSize;
    gLevel.mine = minesAmount;
    restart();
}

function checkVictory() {
    var countMine = 0;
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                if (!cell.isMarked) {
                    countMine++;
                    if (countMine > 2) return;
                }
            }
            else {
                if (!cell.isShown) return;
            }
        }
    }
    victory()
}

