'use strict'

// Main, interactions avec le DOM

import { elements } from './modules/elements';
import { actions } from './modules/actions';
import { handlers } from './modules/handlers';
import { gameData } from './modules/gameData';

// Gestionnaires d'événements
document.addEventListener("keydown", handlers.keydownHandler);
document.addEventListener("keyup", handlers.keyupHandler);
document.addEventListener("focus", handlers.focusHandler);
document.addEventListener("blur", handlers.blurHandler);

// Click bouton démarrage
elements.startButton.addEventListener("click", actions.startGame);

// Click bouton redémarrage
elements.restartButton.addEventListener("click", actions.resetGame);

// Css
window.addEventListener("scroll", () => {
    const gameContainer = document.querySelector(".game-container");
    const header = document.querySelector("header");

    if (gameContainer) {
        const gameContainerRect = gameContainer.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();

        header.classList.toggle("sticky", gameContainerRect.top - 50 <= headerRect.height + 50);
    }
});
