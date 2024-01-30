"use strict"

// Handlers, événements des touches de claviers (up and down) et du focus.

import { actions } from './actions';
import { gameData } from './gameData';

const handlers = {
    keydownHandler(evtKeydown) {
        gameData.code = evtKeydown.code;

        if (["Space", "ArrowUp", "KeyW"].includes(gameData.code)) {
            actions.jump();
            evtKeydown.preventDefault();
            gameData.isFrozen = true;
        }
    },

    keyupHandler(evtKeyup) {
        gameData.code = evtKeyup.code;
        if (["Space", "ArrowUp", "KeyW"].includes(gameData.code)) {
            gameData.isFrozen = false;
        }
    },

    focusHandler() {
        document.addEventListener("keydown", handlers.keydownHandler);
    },

    blurHandler() {
        document.removeEventListener("keydown", handlers.keydownHandler);
    },
};

export { handlers };