"use strict"

/*Actions :
- Saut(jump), 
- Déplacements obstacles (moveObstacle, resetObstacle, updateObstaclePosition),
- Collisions (checkCollision, handleCollision),
- Condition de gain (checkWinCondition),
- Partie cachée (showHiddenPart)
- Actions démarrage/arrêt (reset, start, stop),
- Déplacement images (moveBackground, updateSprite)
- Boucle de jeu (gameLoop);
 */ 

import { elements } from '/elements';

const actions = {
    jump() {
        if (gameData.gameRunning && !gameData.isJumping) {
            gameData.isJumping = true;
            jumpSound.play();
            let jumpHeight = 0;
            let posFoxBottom;
            
            const jumpInterval = setInterval(() => {
                posFoxBottom = parseFloat(getComputedStyle(elements.fox).bottom);

                if (jumpHeight < 70) {
                    elements.fox.style.bottom = `${posFoxBottom + 15}px`;
                    jumpHeight += 5;
                } else {
                    clearInterval(jumpInterval);

                    const fallInterval = setInterval(() => {
                        posFoxBottom = parseFloat(getComputedStyle(elements.fox).bottom);
                        elements.fox.style.bottom = `${posFoxBottom - 10}px`;

                        if (posFoxBottom <= 0) {
                            elements.fox.style.bottom = "0";
                            gameData.isJumping = false;
                            clearInterval(fallInterval);
                        }
                    }, 30);
                }
            }, 30);
        }
    },
    
    moveObstacle() {
        if (gameData.gameRunning) {
            const posObscLeft2 = parseFloat(getComputedStyle(elements.obstacle).left);
            let speedMultiplier = 1;

            if (gameData.score >= 60) {
                speedMultiplier = 2;
            } else if (gameData.score >= 30) {
                speedMultiplier = 1.25;
            }

            const moveObstacleLeft = (element, offset) => {
                const posObstacleLeft = parseFloat(getComputedStyle(element).left);

                if (posObstacleLeft <= -20) {
                    actions.resetObstacle(element, offset);
                } else {
                    actions.updateObstaclePosition(element, posObstacleLeft, speedMultiplier);
                }
            };

            moveObstacleLeft(elements.obstacle, 150);
        }

        gameData.gameLoopInterval = requestAnimationFrame(actions.gameLoop);
    },

    resetObstacle(element, offset) {
        let minGap = 100;
        let randomPosition = Math.random() * offset + minGap;

        element.style.left = `${randomPosition}%`;

        let randomRow = Math.floor(Math.random() * 3);
        let randomColumn = Math.floor(Math.random() * 3);
        let spriteWidth = 124;
        let spriteHeight = 110;
        element.style.backgroundPosition = `-${spriteWidth * randomColumn}px -${spriteHeight * randomRow}px`;

        if (!gameData.isFrozen) {
            gameData.score += 10;
            elements.scoreElement.innerHTML = `Score: ${gameData.score}`;
            actions.checkWinCondition();
        }
    },

    updateObstaclePosition(element, posObstacleLeft, speedMultiplier) {
        element.style.left = `${posObstacleLeft - 7 * speedMultiplier}px`;
    },

    checkCollision() {
        const foxRect = elements.fox.getBoundingClientRect();
        const obstacleRect = elements.obstacle.getBoundingClientRect();

        if (
            foxRect.bottom > obstacleRect.top + 10 &&
            foxRect.top < obstacleRect.bottom - 10 &&
            foxRect.right > obstacleRect.left + 10 &&
            foxRect.left < obstacleRect.right - 10
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
            elements.obstacle.style.display = "none";
            elements.backgroundCloud.style.display = "none";
            elements.backgroundDark.style.display = "block";
            document.removeEventListener("keydown", handlers.keydownHandler);
            elements.ambiantSound.pause();
            cancelAnimationFrame(gameData.gameLoopInterval);
            elements.defeatSound.play();
        }
    },

    checkWinCondition() {
        if (gameData.score >= 100 && gameData.gameRunning) {
            actions.stopGame();
            elements.winGameMessage.style.display = "block";
            elements.ambiantSound.pause();
            elements.victorySound.play();

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
        elements.background.style.display = "";
        elements.header.style.position = "initial";
        gameData.score = 0;
        elements.scoreElement.innerHTML = "Score: 0";
        elements.scoreElement.style.display = "";
        window.scroll({
            top: 5000,
            left: 0,
            behavior: "smooth",
        });
        cancelAnimationFrame(gameData.gameLoopInterval);
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
        elements.ambiantSound.load();
        cancelAnimationFrame(gameData.gameLoopInterval);
        actions.startGame();
    },

    startGame() {
        if (!gameData.gameRunning) {
            gameData.gameRunning = true;
            gameData.gameLoopInterval = requestAnimationFrame(actions.gameLoop);
            gameData.isFrozen = false;
            gameData.isJumping = false;
            elements.startMessage.style.display = "none";
            elements.fox.style.display = "block";
            elements.obstacle.style.display = "block";
            elements.backgroundCloud.style.display = "";
            elements.obstacle.style.left = "100%";
            elements.fox.style.bottom = "0px";
            elements.ambiantSound.play();
            actions.moveBackground();
            document.addEventListener("keydown", handlers.keydownHandler);
        }
    },

    stopGame() {
        gameData.gameRunning = false;
        elements.fox.style.display = "none";
        elements.obstacle.style.display = "none";
        elements.backgroundCloud.style.display = "none";
        elements.backgroundWin.style.display = "block";
        elements.scoreElement.style.display = "none";
        elements.background.style.display = "none";
    },

    moveBackground() {
        if (gameData.gameRunning) {
            gameData.position -= 2;
            elements.background.style.backgroundPosition = `${gameData.position}px 0`;

            const cloudSpeedMultiplier = 0.5;
            gameData.cloudPosition = gameData.position * cloudSpeedMultiplier;
            elements.backgroundCloud.style.backgroundPosition = `${gameData.cloudPosition}px 0`;

            requestAnimationFrame(() => actions.moveBackground());
        }
    },

    updateSprite() {
        if (!gameData.isFrozen && (!gameData.lastSpriteUpdate || Date.now() - gameData.lastSpriteUpdate >= 100)) {
            gameData.spritePosition -= 195.25;
            elements.fox.style.backgroundPosition = `${gameData.spritePosition}px 0`;
            gameData.lastSpriteUpdate = Date.now();
        }
    },

    gameLoop() {
        actions.moveObstacle();
        actions.checkCollision();
        actions.updateSprite(Date.now());
    },
};

export { actions };