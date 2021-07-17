var PLAYER_CIRCLE = 'circle';
var PLAYER_CROSS = 'cross';
var PLAYER_WIN = 'win';

var stage = document.getElementById('stage');
var buttonCircle = document.getElementById('buttonCircle');
var buttonCross = document.getElementById('buttonCross');
var buttonReset = document.getElementById('buttonReset');
var stageButtons = document.querySelectorAll('#stage button');

var currentPlayer = null;
var state = Object.assign({}, Array(9).fill(null));

function checkWin() {
  var patterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (var i = 0; i < patterns.length; ++i) {
    var p = patterns[i];
    if (state[p[0]] === null || state[p[1]] === null || state[p[2]] === null) {
      continue;
    }
    if (state[p[0]] === state[p[1]] && state[p[1]] === state[p[2]]) {
      return p;
    }
  }
  return false;
}

function disablePlayerButtons() {
  buttonCross.disabled = true;
  buttonCircle.disabled = true;
}

function enablePlayerButtons() {
  buttonCross.disabled = false;
  buttonCircle.disabled = false;
  setCrossLight(null);
  setCircleLight(null);
  setStagePlayer(null);
  resetStageButtons();
}

function showWinningMoves(buttonIds) {
  buttonIds.forEach(function (i) {
    document.getElementById(i).classList.add(PLAYER_WIN);
  });
  if (currentPlayer === PLAYER_CIRCLE) {
    setCircleLight('green');
  } else if (currentPlayer === PLAYER_CROSS) {
    setCrossLight('green');
  }
}

function resetStageButtons() {
  stageButtons.forEach(function (stageButton) {
    setStageButtonValue(stageButton, null);
    stageButton.classList.remove(PLAYER_WIN);
  });
  setStageButtonsEnabled(false);
  state = Object.assign({}, Array(9).fill(null));
}

function setStageButtonsEnabled(enabled = true) {
  stageButtons.forEach(function (stageButton) {
    stageButton.disabled = !enabled;
    if (!enabled) {
      stageButton.onclick = null;
      return;
    }
    stageButton.onclick = function (evt) {
      var stageButton = evt.target;
      switch (currentPlayer) {
        case PLAYER_CIRCLE:
          if (setStageButtonValue(stageButton, PLAYER_CIRCLE)) {
            setStagePlayer(PLAYER_CROSS);
          }
          break;
        case PLAYER_CROSS:
          if (setStageButtonValue(stageButton, PLAYER_CROSS)) {
            setStagePlayer(PLAYER_CIRCLE);
          }
          break;
      }
    }
  });
}

function setStagePlayer(player = PLAYER_CIRCLE) {
  var remainingMoves = 0;
  stageButtons.forEach(function (stageButton) {
    if (stageButton.disabled) {
      return;
    }
    stageButton.classList.remove(PLAYER_CIRCLE, PLAYER_CROSS);
    if (player === null) {
      return;
    }
    stageButton.classList.add(player);
    currentPlayer = player;
    switch (player) {
      case PLAYER_CIRCLE:
        disablePlayerButtons();
        setCircleLight();
        setCrossLight(null);
        break;
      case PLAYER_CROSS:
        disablePlayerButtons();
        setCrossLight();
        setCircleLight(null);
        break;
    }
    remainingMoves++;
  });
  if (remainingMoves === 0) {
    setCrossLight(null);
    setCircleLight(null);
  }
}

function setStageButtonValue(stageButton, player = null) {
  if (player === null) {
    stageButton.innerHTML = '';
    stageButton.classList.remove('circle', 'cross');
    return false;
  }
  if (stageButton.innerHTML !== '') {
    return false;
  }
  switch (player) {
    case PLAYER_CIRCLE:
      stageButton.innerHTML = '○';
      stageButton.classList.add('circle');
      state[stageButton.id] = PLAYER_CIRCLE;
      break;
    case PLAYER_CROSS:
      stageButton.innerHTML = '×';
      stageButton.classList.add('cross');
      state[stageButton.id] = PLAYER_CROSS;
      break;
  }
  stageButton.disabled = true;
  var winningButtonIds = checkWin();
  if (winningButtonIds !== false) {
    setStagePlayer(null);
    setStageButtonsEnabled(false);
    showWinningMoves(winningButtonIds);
    return false;
  }
  return true;
}

function setCrossLight(color = 'blue') {
  var light = document.querySelector('#buttonCross .light');
  light.classList.remove('blue', 'green');
  if (color != null) {
    light.classList.add(color);
  }
}

function setCircleLight(color = 'red') {
  var light = document.querySelector('#buttonCircle .light');
  light.classList.remove('red', 'green');
  if (color != null) {
    light.classList.add(color);
  }
}

function resizeStage() {
  var stageWidth = stage.clientWidth;
  stage.style.height = stageWidth + 'px';
  stageButtons.forEach(function (stageButton) {
    stageButton.style.height = (stageWidth / 3) + 'px';
    stageButton.style.fontSize = (stageWidth / 6) + 'px';
  });
}

buttonCross.onclick = function () {
  setStageButtonsEnabled(true);
  setStagePlayer(PLAYER_CROSS);
}

buttonCircle.onclick = function () {
  setStageButtonsEnabled(true);
  setStagePlayer(PLAYER_CIRCLE);
}

buttonReset.onclick = function () {
  enablePlayerButtons();
}

window.onresize = resizeStage;
window.onload = resizeStage;