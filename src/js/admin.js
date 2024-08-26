import $ from './jquery';
import {STATUSES} from './constants';
import {setCodeToUrlParams, getGameStatus} from '../../modules/common'

const urlParams = new URLSearchParams(window.location.search);
const gameCode = urlParams.get("code") || localStorage.getItem("gameCode") || null;

$(document).ready(function () {

  $(".game-code, .game-link").on("click", function () {
    copyGameUrlToClipboard();
  });

  $(".create-game").on("click", function () {
    createNewGame();
  });

  $(".start-game").on("click", function () {
    startGameByAdmin();
  });

  if (Number(localStorage.getItem("gameCode"))) {
    getGameStatus(gameCode)
        .then(res => {
          console.log(res);
          if (res === STATUSES.NOT_FOUND) {
            showStartViewForAdmin();
            localStorage.removeItem("gameCode");
          } else {
            showGameViewForAdmin(gameCode);
            if (localStorage.getItem("gameStatus") === STATUSES.ACTIVE) {
              $('.start-game').addClass('d-none');
              $('.wait-view p').text('Leaderboard:');
            }
          }
        });
  } else {
    showStartViewForAdmin()
  }

  $(".reset-progress").on("click", function () {
    showStartViewForAdmin();
  });

  $('#level-indicator').on('click', function() {
    $('#settings .tooltip').hide();
    $('#levelsWrapper').toggle();
    $('#instructions .tooltip').remove();
  });

});

function showStartViewForAdmin() {
  $(".game-view, .wait-view").addClass('d-none');
  $(".create-view").removeClass('d-none');
}

function showGameViewForAdmin(code) {
  $('.game-code').text(code);
  $('.game-link').text(`${window.baseUrl}/?code=${code}&new`);
  $(".create-view").addClass('d-none');
  $(".wait-view, .game-view").removeClass('d-none');
}

function createNewGame() {
  axios.get(`${window.baseUrl}/api/create-game`)
    .then(res => {
      showGameViewForAdmin(res.data.code);
      $('.start-game').removeClass('d-none');
      localStorage.setItem("gameCode", res.data.code);
      setCodeToUrlParams(res.data.code);
    });
}

function startGameByAdmin() {
  const gameCode = localStorage.getItem("gameCode");
  axios.post(`${window.baseUrl}/api/start-game?code=${gameCode}`)
    .then(res => {
      $('.start-game').addClass('d-none');
      $('.wait-view p').text('Leaderboard:');
      localStorage.setItem("gameStatus", res.data.status);
    });
}

function copyGameUrlToClipboard() {
  const copyText = $('.game-link').text();
  navigator.clipboard.writeText(copyText);
}