'use strict'

const MINE = '💣';
const FLAG = '🚩'
const EMPTY = '';
var gElbtn = document.querySelector('.face');

var gBoard;

var gLevel = {
    size: 4,
    mine: 2
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

//FIXME
//need to fix right click on cell when there is flag on it.



function initGame() {
    gBoard = buildBoard(gLevel.size);
    randomMines(gBoard);
    randomMines(gBoard);
    renderBoard(gBoard);

}

function buildBoard(length) {
    var board = []
    for (var i = 0; i < length; i++) {
        board[i] = []
        for (var j = 0; j < length; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }

            board[i][j] = cell;
        }

    }
    // for (var i = 0; i < gGame.mine; i++) {


    // board[1][1].isMine = true;
    // board[2][2].isMine = true;
    return board
}

function renderBoard(board) {

    var strHTML = '';
    var length = Math.sqrt(gLevel)

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {

            // var cell = board[i][j];
            var cellClass = `cell cell-${i}-${j} cover`

            // if (!cell.isShown) cellClass += ' cover'

            strHTML += `<td class=" ${cellClass}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})">`

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
            if (cell.isMine) {
                negsMinesCount++;

                // gBoard[i][j].minesAroundCount = negsMinesCount;
                // console.log('negsMinesCount', negsMinesCount);
                // console.log('minesAroundCount', cell.minesAroundCount);
            }

        }
    }
    return negsMinesCount;
}
function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]

    currCell.minesAroundCount = setMinesNegsCount(i, j, gBoard);


    if (!currCell.isMine) {
        elCell.classList.remove('cover');
        currCell.isShown = true;
        gGame.shownCount++;
        elCell.classList.add('clicked');
        gGame.markedCount++;
        if (currCell.minesAroundCount) elCell.innerText = currCell.minesAroundCount;

    }


    //should be else after  if (!cell.isMine)
    //changed gBoard[i][j] to cell.isMine
    if (currCell.isMine) {
        currCell.isShown = true;
        elCell.classList.remove('cover');
        gGame.shownCount++;
        elCell.innerText = MINE;
        elCell.style.backgroundColor = 'red'

        // need to use it after 3 lives

        gameOver()
    }


    console.log(currCell);
    console.log('game', gGame);
    // var minesAround = setMinesNegsCount(i, j, gBoard)
}


function gameOver() {
    gGame.isOn = false;
    gElbtn.innerText = '😵'

}

function restart() {
    var elBtn = document.querySelector('.face');
    elBtn.innerText = '😃'
    gGame.isOn = true;
    gGame.markedCount = 0
    initGame();
}


// function cellBomb(){

// }

function cellMarked(elCell, i, j) {
    var currCell = gBoard[i][j];
    window.event.preventDefault();

    if (elCell.classList.contains("clicked")) return;
    // if (gGame.markedCount <= 0) return
    if (currCell.isMarked) {
        // elCell.classList.toggle('clicked')
        currCell.isMarked = false;
        elCell.innerText = EMPTY;
        gGame.markedCount--;
    } else {
        elCell.innerText = FLAG;
        currCell.isMarked = true;
        gGame.markedCount++;
    }

    console.log('currCell', currCell);
    console.log('game', gGame);

}

function changeLevel(boardSize) {
    gLevel.size = boardSize
    initGame();
}

function randomMines(board) {

    var emptyCells = Array.from({ length: board.length }, (_, i) => i);
    shuffle(emptyCells);
    var i = emptyCells.pop()
    var j = emptyCells.pop()
    var location = { i: i, j: j };
    console.log(location);

    board[i][j].isMine = true;
    // board[i][j].isMine = true;




}

    // renderCell(location, MINE)

// }

