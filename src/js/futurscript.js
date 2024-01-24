"use strict";

const gameContainer = document.getElementById("game-container");
const fox = document.getElementById("fox");
const gameOverMessage = document.getElementById("game-over-message");
const startMessage = document.getElementById("start-message");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const backgroundCloud = document.getElementById('background-cloud');
let position = 0;
let spritePosition = 1;
let isFrozen = false;
let isJumping = false;
let code;
let gameRunning = false;
let gameLoopInterval;

const obstacle = {
    generateRandom: function () {
        const obstacleImages = ["/src/img/obstacles/obstacle1.png", "./src/obstacles/obstacle2.png", "./src/obstacles/obstacle3.png"];
        const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
        randomImage.style.left = "100%";
    },

    moveAll: function () {
        const obstacles = document.querySelectorAll(".allObstacle");

        obstacles.forEach((obstacle) => {
            const posObscLeft = parseFloat(getComputedStyle(obstacle).left);

            if (posObscLeft <= -20) {
                obstacle.remove();
            } else {
                obstacle.style.left = posObscLeft - 10 + "px";
            }
        });
    }
};


// Generate a random obstacle with a random image
obstacle.generateRandom();

// Move all obstacles
obstacle.moveAll();

// Gestionnaire d'événements pour les touches enfoncées
const keydownHandler = function(evtKeydown) {
    code = evtKeydown.code;
    if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
        jump();
        evtKeydown.preventDefault();
        isFrozen = true;
    }
};

// Gestionnaire d'événements pour les touches relâchées
const keyupHandler = function(evtKeyup) {
    code = evtKeyup.code;
    if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
        isFrozen = false;
    }
};

// Gestionnaire d'événements focus
const focusHandler = function() {
    document.addEventListener("keydown", keydownHandler);
};

// Gestionnaire d'événements non-focus
const blurHandler = function() {
    document.removeEventListener("keydown", keydownHandler);
};


// Fonction de saut
const jump = function() {
    if (gameRunning && !isJumping) {
        isJumping = true;
        let jumpHeight = 0;
        let posFoxBottom;

        const jumpInterval = setInterval(() => {
            posFoxBottom = parseFloat(getComputedStyle(fox).bottom);

            if (jumpHeight < 60) {
                fox.style.bottom = posFoxBottom + 15 + "px";
                jumpHeight += 5;
            } else {
                clearInterval(jumpInterval);

                const fallInterval = setInterval(() => {
                    posFoxBottom = parseFloat(getComputedStyle(fox).bottom);
                    fox.style.bottom = posFoxBottom - 4 + "px";

                    if (posFoxBottom <= 0) {
                        fox.style.bottom = 0;
                        isJumping = false;
                        clearInterval(fallInterval);
                    }
                }, 30);
            }
        }, 30);
    }
};

// Fonction du Sprite
const updateSprite = () => {
    if (!isFrozen) {
        spritePosition -= 195.25; // largeur du sprite
        fox.style.backgroundPosition = `${spritePosition}px 0`;
    }
};
setInterval(updateSprite, 150);




// Fonction de vérification de la collision
const checkCollision = function() {
    const foxRect = fox.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        foxRect.bottom > obstacleRect.top &&
        foxRect.top < obstacleRect.bottom &&
        foxRect.right > obstacleRect.left &&
        foxRect.left < obstacleRect.right
    ) {
        handleCollision();
    }
};

// Fonction de gestion de la collision
const handleCollision = function() {
    gameRunning = false;
    gameOverMessage.style.display = "block";
    fox.style.display = "none";
    obstacle.style.display = "none";
    backgroundCloud.style.display = "none";
    backgroundDark.style.display = "block";
    console.log("Collision détectée !");
    document.removeEventListener("keydown", keydownHandler);
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 40);
};


// Fonction démarrage du jeu
const startGame = function() {
    if (!gameRunning) {
        gameRunning = true;
        gameLoopInterval = setInterval(gameLoop, 40);
        startMessage.style.display = "none"; 
        fox.style.display = "block";
        obstacle.style.display = "block"; 
        backgroundCloud.style.display = "";
        isFrozen = false;
        isJumping = false;
        obstacle.style.left = "100%";
        fox.style.bottom = "0px";
        document.addEventListener("keydown", keydownHandler);
    }
};

// Fonction du redémarrage du jeu
const restartGame = function() {
    gameOverMessage.style.display = "none";
    fox.style.display = "block";
    obstacle.style.display = "block";
    backgroundCloud.style.display = "";
    backgroundDark.style.display = "none";
    isFrozen = false;
    isJumping = false;
    gameRunning = true;
    obstacle.style.left = "100%";
    fox.style.bottom = "0px";
    document.addEventListener("keydown", keydownHandler);
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 40);
};
 

// Fonction du déplacement du fond
const moveBackground = function() {
    position -= 1;
    backgroundCloud.style.backgroundPosition = `${position}px 0`;
    requestAnimationFrame(moveBackground);
};
moveBackground();
    
// Fonction de boucle de jeu
const gameLoop = function() {
    moveObstacle();
    checkCollision();
};

// Initialisation des gestionnaires d'événements
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("focus", focusHandler);
document.addEventListener("blur", blurHandler);


// Ajoutez un écouteur d'événements pour le bouton de démarrage
startButton.addEventListener("click", startGame);

// Ajoutez un écouteur d'événements pour le bouton de redémarrage
restartButton.addEventListener("click", restartGame);

