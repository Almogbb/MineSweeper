'use strict'

const MINE = '💣';
const FLAG = '🚩'
const EMPTY = '';
const SAFE = '💡'

var gElbtn = document.querySelector('.face');
var gElLives = document.querySelector('.lives');
var gBoard;
var gInterval;
var gMilliSec;
var gSec;
var gMin;
var gLives;
var gIsFirstClick;
var gGameTimeStart;
var gIsVictory;
var gSafeClick;

var gLevel = {
    size: 4,
    mine: 2,
    live: 2
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
    gLives = gLevel.live;
    gIsVictory = false;
    gElLives.innerText = `${gLevel.live} Lives Left!`
    bestScore();
    renderHighScore();
    gIsFirstClick = true;
    gSafeClick = 3;
    renderSafeClick();
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

    var mineCount = 0;
    while (mineCount < gLevel.mine) {
        var firstI = getRandomInt(0, board.length - 1);
        var firstJ = getRandomInt(0, board.length - 1);

        if (!board[firstI][firstJ].isMine) {
            board[firstI][firstJ].isMine = true;
            mineCount++;
        }
    }
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

function cellClicked(elCell, i, j) {

    var currCell = gBoard[i][j];
    if (!gGame.isOn) return;
    if (currCell.isShown) return
    if (currCell.isMarked) return;

    currCell.minesAroundCount = setMinesNegsCount(i, j, gBoard);

    if (gIsFirstClick) {
        gGameTimeStart = Date.now();
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

        if (gLives <= 0) gameOver(elCell);
    }

    if (!currCell.minesAroundCount && !currCell.isMine) expendNegs(i, j, gBoard);

    checkVictory();
    bestScore();
}

function lives() {
    gLives--;
    gElLives.innerText = `${gLives > 0 ? gLives + ' Lives Left!' : 'You Lose'} `;
}

function victory() {

    gGame.isOn = false;
    gElbtn.innerText = '😎';
    clearInterval(gInterval);
    gInterval = null;
    gElLives.innerText = 'You Won';
}

function gameOver(elCurrCell) {
    gGame.isOn = false;
    gElbtn.innerText = '😵';
    clearInterval(gInterval)
    gInterval = null;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            if (gBoard[i][j].isMine && !gBoard.isShown) {
                elCell.classList.remove('cover');
                elCell.classList.add('clicked');
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
    clearInterval(gInterval);
    gInterval = 0;
    initGame();
    gElLives.innerText = `${gLives > 0 ? gLives + ' Lives Left!' : 'You Lose'} `;
}

function cellMarked(elCell, i, j) {
    window.event.preventDefault();
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];

    if (gIsFirstClick) {
        gGameTimeStart = Date.now();
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
    checkVictory();
    bestScore();
}

function expendNegs(row, col, board) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === row && j === col) continue;

            var currCell = board[i][j];
            if (currCell.isMarked) continue;

            currCell.minesAroundCount = setMinesNegsCount(i, j, board);
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);

            if (!currCell.minesAroundCount && !board[i][j].isShown) {
                board[i][j].isShown = true;
                gGame.shownCount++;
                expendNegs(i, j, gBoard);
            }

            if (!currCell.isShown) {
                gGame.shownCount++;
                currCell.isShown = true;
            }

            elCell.innerText = currCell.minesAroundCount ? currCell.minesAroundCount : '';
            elCell.classList.remove('cover');
            elCell.classList.add('clicked');
        }
    }
}

function checkVictory() {
    var countMine = 0;
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                if (!cell.isMarked) {
                    countMine++;
                    if (countMine > gLives) return;
                }
            }
            else {
                if (!cell.isShown) return;
            }
        }
    }
    gIsVictory = true;
    victory();
}

function bestScore() {

    if (gIsVictory) {
        var gameTimeEnd = Date.now();
        var score = Math.abs(gGameTimeStart - gameTimeEnd);
        var scoreInSec = Math.trunc(score / 1000)

        if (gLevel.size === 4) {
            if (!localStorage.highscore4 || scoreInSec < localStorage.highscore4) {
                localStorage.setItem('highscore4', scoreInSec);
            }
        } else if (gLevel.size === 8) {
            if (!localStorage.highscore8 || scoreInSec < localStorage.highscore8) {
                localStorage.setItem('highscore8', scoreInSec);
            }
        } else if (gLevel.size === 12) {
            if (!localStorage.highscore12 || scoreInSec < localStorage.highscore12) {
                localStorage.setItem('highscore12', scoreInSec);
            }
        }
    }
}

function safeClick(board) {
    var runTime = 0;
    var cellLocation = emptyCell(board);
    var removedNums = cellLocation.pop();

    if (!removedNums) return;
    if (!gSafeClick) {
        return;
    }

    if (!gBoard[removedNums.i][removedNums.j].isShown) {
        var elCell = document.querySelector(`[data-i="${removedNums.i}"][data-j="${removedNums.j}"]`);
        var intervalId = setInterval(function () {
            runTime++;
            elCell.classList.add('safe-click');
            if (runTime === 13) {
                clearInterval(intervalId);
                elCell.classList.remove('safe-click');
            }
        }, 100);
    }
    --gSafeClick;
    renderSafeClick()
}


