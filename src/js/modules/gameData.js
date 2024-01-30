"use strict"

// Game Data, état des paramètres du jeu

const gameData = {
    score: 0,
    position: 0,
    cloudPosition: 0,
    spritePosition: 1,
    isFrozen: false,
    isJumping: false,
    gameRunning: false,
    gameLoopInterval: 60,
    code: null,
};

export { gameData };