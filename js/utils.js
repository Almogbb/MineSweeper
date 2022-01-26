'use script'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}
