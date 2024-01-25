    "use strict";

const elements = {
    gameContainer: document.getElementsByClassName("game-container"),
    fox: document.getElementById("fox"),
    roc2 : document.getElementById("roc2"),
    roc3 : document.getElementById("roc3"),
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
    gameLoopInterval: 60,
    code: null,
    jumps: 0,  // Ajout de la variable pour compter les sauts
    maxJumps: 2,  // Nombre maximum de sauts (ajustez selon vos besoins)
    canJump: true,
};

const handlers = {
    // keydownHandler(evtKeydown) {
    //     gameData.code = evtKeydown.code;
    //     if (gameData.code === 'Space' || gameData.code === 'ArrowUp' || gameData.code === 'KeyW') {
    //         actions.jump();
    //         evtKeydown.preventDefault();
    //         gameData.isFrozen = true;
    //     }
    // },
    keydownHandler(evtKeydown) {
        gameData.code = evtKeydown.code;

        if (gameData.canJump && (gameData.code === 'Space' || gameData.code === 'ArrowUp' || gameData.code === 'KeyW')) {
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
        if (gameData.gameRunning && gameData.jumps < gameData.maxJumps) {
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
                        elements.fox.style.bottom = posFoxBottom - 10 + "px";

                        if (posFoxBottom <= 0) {
                            elements.fox.style.bottom = 0;
                            gameData.isJumping = false;
                            gameData.jumps++;  // Incrémentation du compteur de sauts

                            // Réinitialisation du compteur de sauts après un certain délai
                            setTimeout(() => {
                                gameData.jumps = 0;
                            }, 500);  // Ajustez le délai de réinitialisation selon vos besoins
                            
                            clearInterval(fallInterval);
                        }
                    }, 30);
                }
            }, 30);
        }
    },
    // jump() {
    //     if (gameData.gameRunning && !gameData.isJumping) {
    //         gameData.isJumping = true;
    //         let jumpHeight = 0;
    //         let posFoxBottom;

    //         const jumpInterval = setInterval(() => {
    //             posFoxBottom = parseFloat(getComputedStyle(elements.fox).bottom);

    //             if (jumpHeight < 70) {
    //                 elements.fox.style.bottom = posFoxBottom + 15 + "px";
    //                 jumpHeight += 5;
    //             } else {
    //                 clearInterval(jumpInterval);

    //                 const fallInterval = setInterval(() => {
    //                     posFoxBottom = parseFloat(getComputedStyle(elements.fox).bottom);
    //                     elements.fox.style.bottom = posFoxBottom - 10 + "px";

    //                     if (posFoxBottom <= 0) {
    //                         elements.fox.style.bottom = 0;
    //                         gameData.isJumping = false;
    //                         clearInterval(fallInterval);
    //                     }
    //                 }, 30);
    //             }
    //         }, 30);
    //     }
    // },

    updateSprite(timestamp) {
        if (!gameData.isFrozen) {
            if (!gameData.lastSpriteUpdate) {
                gameData.lastSpriteUpdate = timestamp;
            }
    
            const timeElapsed = timestamp - gameData.lastSpriteUpdate;
            if (timeElapsed >= 100) { // 150 millisecondes, ajustez si nécessaire
                gameData.spritePosition -= 195.25;
                elements.fox.style.backgroundPosition = `${gameData.spritePosition}px 0`;
                gameData.lastSpriteUpdate = timestamp;
            }
        }
    },

    // moveObstacle() {
    //     if (gameData.gameRunning) {
    //         const posObscLeft = parseFloat(getComputedStyle(elements.roc3).left);
    
    //         if (posObscLeft <= -20) {
    //             elements.roc3.style.left = "100%";
    //             if (!gameData.isFrozen) {
    //                 gameData.score += 10;
    //                 elements.scoreElement.innerHTML = `Score: ${gameData.score}`;
    //                 actions.checkWinCondition();
    //             }
    //         } else {
    //             elements.roc3.style.left = posObscLeft - 5 + "px";
    //         }
    //         gameData.gameLoopInterval = requestAnimationFrame(actions.gameLoop);
    //     }
    // },

    // ...


    moveObstacle() {
        if (gameData.gameRunning) {
            const posObscLeft3 = parseFloat(getComputedStyle(elements.roc3).left);
            const posObscLeft2 = parseFloat(getComputedStyle(elements.roc2).left);
    
            if (posObscLeft3 <= -20) {
                // Position aléatoire entre 100% et 200%
                const randomPosition = Math.random() * 100 + 100;
                elements.roc3.style.left = randomPosition + "%";
                
                if (!gameData.isFrozen) {
                    gameData.score += 10;
                    elements.scoreElement.innerHTML = `Score: ${gameData.score}`;
                    actions.checkWinCondition();
                }
            } else {
                elements.roc3.style.left = posObscLeft3 - 7 + "px";
            }

            if (posObscLeft2 <= -20) {
                // Position aléatoire entre 100% et 200%
                const randomPosition = Math.random() * 50 + 200;
                elements.roc2.style.left = randomPosition + "%";
                
                if (!gameData.isFrozen) {
                    gameData.score += 10;
                    elements.scoreElement.innerHTML = `Score: ${gameData.score}`;
                    actions.checkWinCondition();
                }
            } else {
                elements.roc2.style.left = posObscLeft2 - 7 + "px";
            }
        }
            gameData.gameLoopInterval = requestAnimationFrame(actions.gameLoop);
        },
    

    checkCollision() {
        const foxRect = elements.fox.getBoundingClientRect();
        const obstacleRect = elements.roc3.getBoundingClientRect();
        const obstacleRect2 = elements.roc2.getBoundingClientRect();

        if (
            foxRect.bottom > obstacleRect.top &&
            foxRect.top < obstacleRect.bottom &&
            foxRect.right > obstacleRect.left &&
            foxRect.left < obstacleRect.right
        ) {
            actions.handleCollision();
            return;
        }

        // Vérification de la collision avec le deuxième obstacle (roc2)
        if (
            foxRect.bottom > obstacleRect2.top &&
            foxRect.top < obstacleRect2.bottom &&
            foxRect.right > obstacleRect2.left &&
            foxRect.left < obstacleRect2.right
        ) {
            actions.handleCollision();
            return;
        }
    },

    handleCollision() {
        if (gameData.gameRunning) {
            gameData.gameRunning = false;
            elements.gameOverMessage.style.display = "block";
            elements.fox.style.display = "none";
            elements.roc3.style.display = "none";
            elements.roc2.style.display = "none";
            elements.backgroundCloud.style.display = "none";
            elements.backgroundDark.style.display = "block";
            document.removeEventListener("keydown", handlers.keydownHandler);
            cancelAnimationFrame(gameData.gameLoopInterval);
            gameData.gameLoopInterval = gameData.gameLoopInterval = requestAnimationFrame(actions.gameLoop);
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
        cancelAnimationFrame(gameData.gameLoopInterval);
        actions.startGame();
    },

    checkWinCondition() {
        if (gameData.score >= 100 && gameData.gameRunning) {
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
            gameData.gameLoopInterval = requestAnimationFrame(actions.gameLoop);
            elements.startMessage.style.display = "none";
            elements.fox.style.display = "block";
            elements.roc3.style.display = "block";
            elements.roc2.style.display = "block";
            elements.backgroundCloud.style.display = "";
            gameData.isFrozen = false;
            gameData.isJumping = false;
            elements.roc3.style.left = "100%";
            elements.roc2.style.left = "100%";
            elements.fox.style.bottom = "0px";
            document.addEventListener("keydown", handlers.keydownHandler);
        }
    },
      

    stopGame() {
        gameData.gameRunning = false;
        elements.fox.style.display = "none";
        elements.roc3.style.display = "none";
        elements.roc2.style.display = "none";
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
        actions.updateSprite(Date.now());
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
// ...

// Click bouton démarrage
elements.startButton.addEventListener("click", actions.startGame);