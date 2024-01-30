"use strict"

// Elements, récupération des références HTML

const elements = {
    gameContainer: document.querySelector(".game-container"),
    fox: document.getElementById("fox"),
    obstacle: document.getElementById("obstacles"),
    gameOverMessage: document.getElementById("game-over-message"),
    startMessage: document.getElementById("start-message"),
    startButton: document.getElementById("start-button"),
    restartButton: document.getElementById("restart-button"),
    background: document.getElementById("background"),
    backgroundCloud: document.getElementById("background-cloud"),
    backgroundDark: document.getElementById("background-dark-sky"),
    backgroundWin: document.getElementById("background-win"),
    scoreElement: document.getElementById("score"),
    hiddenPart: document.querySelector(".hide-cv"),
    showCvButton: document.getElementById("show-cv"),
    winGameMessage: document.getElementById("win-game"),
    header: document.querySelector("header"),
    jumpSound: document.getElementById("jumpSound"),
    victorySound: document.getElementById("victorySound"),
    defeatSound: document.getElementById("defeatSound"),
    ambiantSound: document.getElementById("ambiantSound"),
};

export { elements } ;