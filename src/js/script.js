    "use strict"
    
    const gameContainer = document.getElementById("game-container");
    const fox = document.getElementById("fox");
    const obstacle = document.getElementById("obstacle");
    const obstacles2 = document.getElementById("obstacle2");
    const gameOverMessage = document.getElementById("game-over-message");
    const startMessage = document.getElementById("start-message");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const backgroundCloud = document.getElementById('background-cloud');
    const backgroundDark = document.getElementById("background-dark-sky");
    const backgroundWin = document.getElementById("background-win");
    const scoreElement = document.getElementById("score");
    const hiddenPart = document.querySelector(".hide-cv");
    const showCvButton = document.getElementById("show-cv");
    const winGameMessage = document.getElementById("win-game");
    let score = 0;
    let position = 0;
    let spritePosition = 1;
    let isFrozen = false;
    let isJumping = false;
    let gameRunning = false;
    let gameLoopInterval;
    let code;

   // Gestionnaire touches enfoncées
    const keydownHandler = function(evtKeydown) {
        code = evtKeydown.code;
        if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
            jump();
            evtKeydown.preventDefault();
            isFrozen = true;
        }
    };

    // Gestionnaire touches relâchées
    const keyupHandler = function(evtKeyup) {
        code = evtKeyup.code;
        if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
            isFrozen = false;
        }
    };
    
   // Gestionnaire focus
    const focusHandler = function() {
        document.addEventListener("keydown", keydownHandler);
    };

    // Gestionnaire non-focus
    const blurHandler = function() {
        document.removeEventListener("keydown", keydownHandler);
    };

  
    // Fonction saut
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
    
    // Fonction sprite
    const updateSprite = () => {
        if (!isFrozen) {
            spritePosition -= 195.25;
            fox.style.backgroundPosition = `${spritePosition}px 0`;
        }
    };
    setInterval(updateSprite, 150);

    // Fonction déplacement obstacle
    const moveObstacle = function() {
        if (gameRunning) {
            const posObscLeft = parseFloat(getComputedStyle(obstacle2).left);
    
            if (posObscLeft <= -20) {
                obstacle2.style.left = "100%";
                if (!isFrozen) {
                    score += 10;
                    scoreElement.innerHTML = `Score: ${score}`;
                    checkWinCondition();
                }
            } else {
                obstacle2.style.left = posObscLeft - 10 + "px";
            }
            clearInterval(gameLoopInterval);
            gameLoopInterval = setInterval(gameLoop, 40);
        }
    };

    // Fonction vérification collision
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
    
    // Fonction gestion collision
    const handleCollision = function() {
        if (gameRunning) {
            gameRunning = false;
            gameOverMessage.style.display = "block";
            fox.style.display = "none";
            obstacle.style.display = "none";
            backgroundCloud.style.display = "none";
            backgroundDark.style.display = "block";
            document.removeEventListener("keydown", keydownHandler);
            clearInterval(gameLoopInterval);
            gameLoopInterval = setInterval(gameLoop, 40);
        }
    };

    // Fonction reset/redémarrage
    const resetGame = function() {
        gameRunning = false;
        score = 0;
        scoreElement.innerHTML= "Score: 0";
        position = 0;
        spritePosition = 1;
        isFrozen = false;
        isJumping = false;
        gameOverMessage.style.display = "none";
        backgroundDark.style.display = "none";
        clearInterval(gameLoopInterval);
        startGame();
    };

    // Fonction verification scores
    const checkWinCondition = function() {
        if (score >= 20 && gameRunning) {
            // fox.style.display = "none";
            // obstacle.style.display = "none";
            stopGame();
            winGameMessage.style.display = "block";
             
            if (showCvButton) {
                showCvButton.addEventListener("click", showHiddenPart);
            }        
        }
    };

    // Fonction affichage récompense
    const showHiddenPart = function() {
        hiddenPart.style.display = "flex";
        winGameMessage.style.display = "none";
        startMessage.style.display = "block";
        backgroundWin.style.display = "none";
        backgroundCloud.style.display = "";
        window.scroll({
            top: 5000,
            left: 0,
            behavior: "smooth",
          });        
    };

    // Fonction démarrage du jeu
    const startGame = function() {
        if (!gameRunning) {
            gameRunning = true;
            gameLoopInterval = setInterval(gameLoop, 40);
            startMessage.style.display = "none";
            fox.style.display = "block";
            obstacle2.style.display = "block";
            backgroundCloud.style.display = "";
            isFrozen = false;
            isJumping = false;
            obstacle2.style.left = "100%";
            fox.style.bottom = "0px";
            document.addEventListener("keydown", keydownHandler);
        }
    };
    // Fonction arrêt du jeu 
    const stopGame = function() {
        gameRunning = false;
        fox.style.display = "none";
        obstacle2.style.display = "none";
        backgroundCloud.style.display = "none";
        backgroundWin.style.display = "block";
         scoreElement.style.display = "none";
    
    }

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

    // gestionnaires d'événements
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("keyup", keyupHandler);
    document.addEventListener("focus", focusHandler);
    document.addEventListener("blur", blurHandler);


    // click bouton démarrage
    startButton.addEventListener("click", startGame);

    // click bouton redémarrage
    restartButton.addEventListener("click", resetGame);
    
   