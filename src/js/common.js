import $ from './jquery';
import 'regenerator-runtime/runtime';
import {setCodeToUrlParams, showLeaderBoard} from '../../modules/common'


const intervalTimeout = 1000;
const urlMatch = window.location.pathname.match(/\/(.*?)\//);
const hostingDirectory = urlMatch ? "/" + urlMatch[1] : "";
window.baseUrl = window.location.origin + hostingDirectory;

const urlParams = new URLSearchParams(window.location.search);
const gameCode = urlParams.get("code") || localStorage.getItem("gameCode") || null;
const isNewGame = !!urlParams.has("new");

$(document).ready(function () {

  if (isNewGame) {
    localStorage.removeItem("gameCode");
    localStorage.removeItem("userRole");
    localStorage.removeItem("gameStatus");
    localStorage.removeItem("userId");
    localStorage.removeItem("userIsLogged");
    urlParams.delete("new");
  }
  if (gameCode) {
    localStorage.setItem("gameCode", gameCode);
    setCodeToUrlParams(gameCode);
  }
  // Custom scrollbar plugin
  // $(".level-menu").mCustomScrollbar({
  //   scrollInertia: 0,
  //   autoHideScrollbar: true
  // });

  $(".note-toggle").on("click", function () {
    if(!$(".note-toggle").hasClass('disabled')) {
      $(".note").slideToggle();
    }
  });

  showLeaderBoard();

  setInterval(function() {
    showLeaderBoard();
  }, intervalTimeout);

});