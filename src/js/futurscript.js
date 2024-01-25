"use strict";

const elements = {
    gameContainer: document.getElementById("game-container"),
    fox: document.getElementById("fox"),
    obstacle: document.getElementById("obstacle"),
    obstacle2: document.getElementById("obstacle2"),
    gameOverMessage: document.getElementById("game-over-message"),
    startMessage: document.getElementById("start-message"),
    startButton: document.getElementById("start-button"),
    restartButton: document.getElementById("restart-button"),
    backgroundCloud: document.getElementById('background-cloud'),
    backgroundDark: document.getElementById("background-dark-sky"),
    backgroundWin: document.getElementById("background-win"),
    scoreElement: document.getElementById("score"),
    hiddenPart: document.querySelector(".hide-cv"),
    showCvButton: document.getElementById("show-cv"),
    winGameMessage: document.getElementById("win-game"),
    header: document.querySelector("header")
};

const gameData = {
    score: 0,
    position: 0,
    spritePosition: 1,
    isFrozen: false,
    isJumping: false,
    gameRunning: false,
    gameLoopInterval: null,
    code: null
};

const handlers = {
    keydownHandler(evtKeydown) {
        gameData.code = evtKeydown.code;
        if (gameData.code === 'Space' || gameData.code === 'ArrowUp' || gameData.code === 'KeyW') {
            actions.jump();
            evtKeydown.preventDefault();
            gameData.isFrozen = true;
        }
    },

    keyupHandler(evtKeyup) {
        gameData.code = evtKeyup.code;
        if (gameData.code === 'Space' || gameData.code === 'ArrowUp' || gameData.code === 'KeyW') {
            gameData.isFrozen = false;
        }
    },

    focusHandler() {
        document.addEventListener("keydown", handlers.keydownHandler);
    },

    blurHandler() {
        document.removeEventListener("keydown", handlers.keydownHandler);
    }
};

const actions = {
    jump() {
        if (gameData.gameRunning && !gameData.isJumping) {
            gameData.isJumping = true;
            let jumpHeight = 0;
            let posFoxBottom;

            const jumpInterval = setInterval(() => {
                posFoxBottom = parseFloat(getComputedStyle(elements.fox).bottom);

                if (jumpHeight < 60) {
                    elements.fox.style.bottom = posFoxBottom + 15 + "px";
                    jumpHeight += 5;
                } else {
                    clearInterval(jumpInterval);

                    const fallInterval = setInterval(() => {
                        posFoxBottom = parseFloat(getComputedStyle(elements.fox).bottom);
                        elements.fox.style.bottom = posFoxBottom - 4 + "px";

                        if (posFoxBottom <= 0) {
                            elements.fox.style.bottom = 0;
                            gameData.isJumping = false;
                            clearInterval(fallInterval);
                        }
                    }, 30);
                }
            }, 30);
        }
    },

    updateSprite() {
        if (!gameData.isFrozen) {
            gameData.spritePosition -= 195.25;
            elements.fox.style.backgroundPosition = `${gameData.spritePosition}px 0`;
        }
    },

    moveObstacle() {
        if (gameData.gameRunning) {
            const posObscLeft = parseFloat(getComputedStyle(elements.obstacle2).left);

            if (posObscLeft <= -20) {
                elements.obstacle2.style.left = "100%";
                if (!gameData.isFrozen) {
                    gameData.score += 10;
                    elements.scoreElement.innerHTML = `Score: ${gameData.score}`;
                    actions.checkWinCondition();
                }
            } else {
                elements.obstacle2.style.left = posObscLeft - 10 + "px";
            }
            clearInterval(gameData.gameLoopInterval);
            gameData.gameLoopInterval = setInterval(actions.gameLoop, 40);
        }
    },

    checkCollision() {
        const foxRect = elements.fox.getBoundingClientRect();
        const obstacleRect = elements.obstacle.getBoundingClientRect();

        if (
            foxRect.bottom > obstacleRect.top &&
            foxRect.top < obstacleRect.bottom &&
            foxRect.right > obstacleRect.left &&
            foxRect.left < obstacleRect.right
        ) {
            actions.handleCollision();
        }
    },

    handleCollision() {
        if (gameData.gameRunning) {
            gameData.gameRunning = false;
            elements.gameOverMessage.style.display = "block";
            elements.fox.style.display = "none";
            elements.obstacle.style.display = "none";
            elements.backgroundCloud.style.display = "none";
            elements.backgroundDark.style.display = "block";
            document.removeEventListener("keydown", handlers.keydownHandler);
            clearInterval(gameData.gameLoopInterval);
            gameData.gameLoopInterval = setInterval(actions.gameLoop, 40);
        }
    },

    resetGame() {
        gameData.gameRunning = false;
        gameData.score = 0;
        elements.scoreElement.innerHTML = "Score: 0";
        gameData.position = 0;
        gameData.spritePosition = 1;
        gameData.isFrozen = false;
        gameData.isJumping = false;
        elements.gameOverMessage.style.display = "none";
        elements.backgroundDark.style.display = "none";
        clearInterval(gameData.gameLoopInterval);
        actions.startGame();
    },

    checkWinCondition() {
        if (gameData.score >= 20 && gameData.gameRunning) {
            actions.stopGame();
            elements.winGameMessage.style.display = "block";

            if (elements.showCvButton) {
                elements.showCvButton.addEventListener("click", actions.showHiddenPart);
            }
        }
    },

    showHiddenPart() {
        elements.hiddenPart.style.display = "flex";
        elements.winGameMessage.style.display = "none";
        elements.startMessage.style.display = "block";
        elements.backgroundWin.style.display = "none";
        elements.backgroundCloud.style.display = "";
        window.scroll({
            top: 5000,
            left: 0,
            behavior: "smooth",
        });
        elements.header.style.position = "initial";
    },

    startGame() {
        if (!gameData.gameRunning) {
            gameData.gameRunning = true;
            gameData.gameLoopInterval = setInterval(actions.gameLoop, 40);
            setInterval(actions.updateSprite, 150);
            elements.startMessage.style.display = "none";
            elements.fox.style.display = "block";
            elements.obstacle2.style.display = "block";
            elements.backgroundCloud.style.display = "";
            gameData.isFrozen = false;
            gameData.isJumping = false;
            elements.obstacle2.style.left = "100%";
            elements.fox.style.bottom = "0px";
            document.addEventListener("keydown", handlers.keydownHandler);
        }
    },

    stopGame() {
        gameData.gameRunning = false;
        elements.fox.style.display = "none";
        elements.obstacle2.style.display = "none";
        elements.backgroundCloud.style.display = "none";
        elements.backgroundWin.style.display = "block";
        elements.scoreElement.style.display = "none";
    },

    moveBackground() {
        gameData.position -= 1;
        elements.backgroundCloud.style.backgroundPosition = `${gameData.position}px 0`;
        requestAnimationFrame(actions.moveBackground);
    },

    gameLoop() {
        actions.moveObstacle();
        actions.checkCollision();
    }
};

// Gestionnaires d'événements
document.addEventListener("keydown", handlers.keydownHandler);
document.addEventListener("keyup", handlers.keyupHandler);
document.addEventListener("focus", handlers.focusHandler);
document.addEventListener("blur", handlers.blurHandler);

// Click bouton démarrage
elements.startButton.addEventListener("click", actions.startGame);

// Click bouton redémarrage
elements.restartButton.addEventListener("click", actions.resetGame);

// Démarrage du déplacement du fond
actions.moveBackground();
