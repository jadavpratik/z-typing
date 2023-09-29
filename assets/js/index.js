// Constants
import { MESSAGES } from './constants.js';

// Utils
import { initGame } from './utils.js';

// DOMElements
import { gameStartButtonEl } from './dom-elements.js';

// Is CapsLock TurnedOn ?
window.addEventListener('keyup', function (event) {
	if (event.getModifierState('CapsLock'))
		Swal.fire(MESSAGES.TURN_OFF_CAPS_LOCK, '', 'warning');
});

gameStartButtonEl.addEventListener('click', initGame);

// DISCLAIMER : Website is only supported on Desktop Version only.
