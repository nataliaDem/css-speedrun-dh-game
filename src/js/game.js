import $ from './jquery';
import {STATUSES} from './constants';
import {getGameStatus} from '../../modules/common'

const intervalTimeout = 1000;

$(document).ready(function() {

  let checkGameStarted;

  function showAuthViewForPlayer() {
    $(".player-game-view, .player-wait-view, .player-start-view").addClass('d-none');
    $(".auth-view").removeClass('d-none');
  }

  function showWaitViewForPlayer() {
    $(".auth-view, .player-game-view, .player-start-view").addClass('d-none');
    $(".player-wait-view").removeClass('d-none');
  }

  function showGameViewForPlayer() {
    $(".auth-view, .player-wait-view, .player-start-view").addClass('d-none');
    $(".player-game-view").removeClass('d-none');
    // game.loadLevel();
  }

  function showGameCodeView() {
    $(".player-game-view, .player-wait-view").addClass('d-none');
    $(".player-start-view").removeClass('d-none');
  }

  function startGameForPlayer() {
    const gameCode = localStorage.getItem("gameCode");
    getGameStatus(gameCode)
        .then(res => {
          console.log(res);
          if (res === STATUSES.ACTIVE) {
            showGameViewForPlayer();
            localStorage.setItem("gameStatus", STATUSES.ACTIVE);
            clearInterval(checkGameStarted);
          }
        });
  }

  function login() {
    const gameCode = localStorage.getItem("gameCode");
    console.log(gameCode);
    const name = $('input.member-name').val();
    console.log(name);
    axios.post(`${window.baseUrl}/api/auth?code=${gameCode}`, {name: name})
        .then(res => {
          console.log(res.data);
          localStorage.setItem("userIsLogged", true);
          localStorage.setItem("userId", res.data.userId);
          showWaitViewForPlayer();
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.delete("new");
          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + urlParams.toString();
          window.history.replaceState({ path: newUrl }, '', newUrl);
          checkGameStarted = setInterval(function() {
            startGameForPlayer()
          }, intervalTimeout);
        });
  }

  function updateProgress(level, timestamp) {
    const gameCode = localStorage.getItem("gameCode");
    const userId = localStorage.getItem("userId")
    axios.post(`${window.baseUrl}/api/update-progress?code=${gameCode}`, {
      id: userId,
      level: level,
      lastAnswerTime: timestamp
    })
        .then(res => {
          console.log(res.data);
        });
  }

  $("input.member-name").on("keypress", function (e) {
    e.stopPropagation();
    if (e.keyCode === 13) {
      login();
      return false;
    }
  });

  $(".submit-login").on("click", function () {
    login();
  });

  if (Number(localStorage.getItem("gameCode"))) {
    if (localStorage.getItem("gameStatus") === STATUSES.ACTIVE) {
      showGameViewForPlayer();
    } else if (localStorage.getItem("userIsLogged")) {
      showWaitViewForPlayer();
      checkGameStarted = setInterval(function() {
        startGameForPlayer()
      }, intervalTimeout);
    } else {
      showAuthViewForPlayer();
    }
  } else {
    showGameCodeView();
  }

  $(".reset-progress").on("click", function () {
    showGameCodeView();
  });

});
