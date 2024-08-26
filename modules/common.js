// import $ from '../src/js/jquery';
const $ = require("../src/js/jquery");

async function getGameStatus(gameCode) {
  return axios.get(`${window.baseUrl}/api/check-game-status?code=${gameCode}`)
    .then(res => {
      return res.data.status;
    });
}

function showLeaderBoard() {
  const gameCode = localStorage.getItem("gameCode");
  const userId = localStorage.getItem("userId");
  if (gameCode) {
    axios.get(`${window.baseUrl}/api/leaderboard?code=${gameCode}`)
      .then(res => {
        console.log(res.data);
        $('.leaderboard').empty();
        for (let [i, member] of res.data.entries()) {
          const item = document.createElement("div");
          if (i === 0) {
            $(item).addClass('leader');
          }
          if (i === 1) {
            $(item).addClass('second');
          }
          if (i === 2) {
            $(item).addClass('third');
          }
          if (member.progress === levels.length) {
            $(item).addClass('completed');
          }
          $(item).html("<div><span class='member-rank'>" + (i + 1) + "</span>" +
            "<span class='member-name'>" + (userId && member.id === Number(userId) ? "> " : "") + member.name + "</span></div>" +
            "<div class='time'>" + formatTime(member.lastAnswerTime) +
            "<span class='member-score'>" + member.progress + "</span></div>");
          $(".leaderboard").append(item);
        }
      });
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatTime(timestamp) {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp)
  return [
    padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
}

function setCodeToUrlParams(gameCode) {
  if (gameCode) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("code", gameCode);
    history.replaceState(null, null, window.location.pathname+"?"+urlParams.toString());
  }
}

function playWinSound(audioId) {
  const audio = document.getElementById(audioId);
  audio.play();
}

function updateProgress(level, timestamp) {
  const gameCode = localStorage.getItem("gameCode");
  const userId = localStorage.getItem("userId")
  axios.post(`${baseUrl}/api/update-progress?code=${gameCode}`, {
    id: userId,
    level: level,
    lastAnswerTime: timestamp
  })
      .then(res => {
        console.log(res.data);
      });
}

module.exports = {
  setCodeToUrlParams,
  playWinSound,
  showLeaderBoard,
  getGameStatus,
  updateProgress
}
