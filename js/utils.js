'use script'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
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

function changeLevel(boardSize, minesAmount, livesAmount) {
    gLevel.size = boardSize;
    gLevel.mine = minesAmount;
    gLevel.live = livesAmount
    restart();
}

function shuffle(nums) {
    var randIdx, keep, i;

    for (i = nums.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, nums.length - 1);

        keep = nums[i];
        nums[i] = nums[randIdx];
        nums[randIdx] = keep;
    }
    return nums;
}

function emptyCell(board) {
    var emptyNums = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j];
            if (!currCell.isMine && !currCell.isShown && !currCell.isMarked) {
                emptyNums.push({ i: i, j: j });
            }
        }
    }
    return shuffle(emptyNums);
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
        elClock.innerText = '00:00:00';
    }
}

function renderSafeClick() {
    var elBox = document.querySelector('.safe-span');
    elBox.innerText = SAFE + SAFE + SAFE;

    switch (gSafeClick) {
        case (3):
            elBox.innerText = `${SAFE} ${SAFE} ${SAFE}`
            break;
        case (2):
            elBox.innerText = `${SAFE} ${SAFE}`
            break;
        case (1):
            elBox.innerText = SAFE;
            break;
        case (0):
            elBox.innerText = `No Safe-Click`;
            break;
        default:
            elBox.innerText = `${SAFE} ${SAFE} ${SAFE}`;
    }
}

function renderHighScore() {
    var elHighScore = document.querySelector('.highScore');

    switch (gLevel.size) {
        case (4):
            elHighScore.innerText = `Best Time Is: ${localStorage.highscore4 ? localStorage.highscore4 + ' Sec' : '"Play to set score!"'}`;
            break;
        case (8):
            elHighScore.innerText = `Best Time Is: ${localStorage.highscore8 ? localStorage.highscore8 + ' Sec' : '"Play to set score!"'}`;
            break;
        case (12):
            elHighScore.innerText = `Best Time Is: ${localStorage.highscore12 ? localStorage.highscore12 + ' Sec' : '"Play to set score!"'}`;
            break;
        // default:
        //     elHighScore.innerText = '"Play to set score!"'
    }
}



function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}
