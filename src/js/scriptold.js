    const gameContainer = document.getElementById("game-container");
    const fox = document.getElementById("fox");
    let spritePosition = 1;
    let isFrozen = false;

    const obstacle = document.getElementById("obstacle");
    let isJumping = false;


    
    // Ajoute les gestionnaires d'événements uniquement lorsque le focus est sur le jeu
    document.addEventListener("keydown", function (evtKeydown) {
        switch (evtKeydown.key) {
            case "Space":
                jump();
                // Empêcher le défilement de la page lorsque la touche est pressée
                evtKeydown.preventDefault();
                break;
            case "ArrowUp":
                jump();
                // Empêcher le défilement de la page lorsque la touche est pressée
                evtKeydown.preventDefault();
                break;
        }
    });
    
    document.addEventListener("focus", function () {
        // Ajoutez les gestionnaires d'événements lorsque le jeu obtient le focus
        document.addEventListener("keydown", keydownHandler);
    });
    
    document.addEventListener("blur", function () {
        // Retirez les gestionnaires d'événements lorsque le jeu perd le focus
        document.removeEventListener("keydown", keydownHandler);
    });
    
    function keydownHandler(evtKeydown) {
        // Gestionnaire d'événements pour les touches ArrowUp et Space
        switch (evtKeydown.key) {
            case "ArrowUp":
            case "Space":
                jump();
                // Empêcher le défilement de la page lorsque la touche est pressée
                evtKeydown.preventDefault();
                break;
        }
    }

    function jump() {
        if (!isJumping) {
            isJumping = true;
            let jumpHeight = 0;
    
            const jumpInterval = setInterval(() => {
                const currentBottom = parseFloat(getComputedStyle(fox).bottom);
    
                if (jumpHeight < 50) {
                    fox.style.bottom = currentBottom + 10 + "px";
                    jumpHeight += 5;
                } else {
                    clearInterval(jumpInterval);
    
                    const fallInterval = setInterval(() => {
                        const currentBottom = parseFloat(getComputedStyle(fox).bottom);
                        fox.style.bottom = currentBottom - 5 + "px";
    
                        if (currentBottom <= 0) {
                            fox.style.bottom = 0;
                            isJumping = false;
                            clearInterval(fallInterval);
                        }
                    }, 25);
                }
            }, 25);
        }
    }

    document.addEventListener("keydown", function (evtKeydown) {
        if (evtKeydown.key === "ArrowUp") {
            isFrozen = true;
        }
    });

    document.addEventListener("keyup", function (evtKeyup) {
        if (evtKeyup.key === "ArrowUp") {
            isFrozen = false;
        }
    });

    setInterval(() => {
        if (!isFrozen) {
            spritePosition -= 195.25; // Ajustez la valeur selon la largeur de votre sprite
            fox.style.backgroundPosition = `${spritePosition}px 0`;
        }
    }, 150);

    function moveObstacle() {
        const currentLeft = parseFloat(getComputedStyle(obstacle).left);

        if (currentLeft <= -20) {
            // Reset the obstacle position when it goes off the screen
            obstacle.style.left = "100%";
        } else {
            obstacle.style.left = currentLeft - 5 + "px";
        }
    }

    function gameLoop() {
        moveObstacle();
        // Add more game logic here
    }

    // Utiliser setInterval pour la boucle de jeu
    setInterval(gameLoop, 40);

    
    // * window.addEventListener('DOMContentLoaded', function(e){
    //     window.onkeydown = function (event) {  
    //     const code = event.code;
        
    //         if(code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
    //             console.log('je saute');
    //         }
            
    //     };  
    // })