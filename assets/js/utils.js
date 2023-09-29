// Constants
import {
	MESSAGES,
	STYLE,
	PARAGRAPHS,
	BUTTON_NAMES,
	LOCAL_STORAGE_KEYS,
} from './constants.js';

// DOMElements
import {
	gameStartMessageEl,
	gameStartButtonEl,
	gameStartDivEl,
	gameFinishDivEl,
	userTypingAccuracyEl,
	userTypingErrorsEl,
	userTypingSpeedEl,
	userTypingTimeEl,
} from './dom-elements.js';

let selectedParagraph,
	spanEl,
	characterIndex,
	errorCount,
	startTime,
	endTime,
	shiftKeyPressCount;

export function initGame() {
	const userName = prompt(MESSAGES.ENTER_NAME);

	if (userName) {
		// store userName to use in certificate
		localStorage.setItem(LOCAL_STORAGE_KEYS.USER_NAME, userName);

		let buttonName = gameStartButtonEl.children[0].innerHTML;

		if (
			buttonName === BUTTON_NAMES.START ||
			buttonName === BUTTON_NAMES.RESTART
		) {
			buttonName = BUTTON_NAMES.DONE;
			gameStartButtonEl.setAttribute('disabled', 'disabled');
			gameStartMessageEl.innerHTML = '';

			gameStartDivEl.classList.remove('d-none');
			gameFinishDivEl.classList.remove('d-flex');
			gameFinishDivEl.classList.add('d-none');

			chooseParagraph();
			gameSetup();
			startTyping();
		}
	}
}

function gameSetup() {
	characterIndex = 0;
	errorCount = 0;
	shiftKeyPressCount = 0;

	const date = new Date();
	startTime = date.getTime();
	spanEl = gameStartMessageEl.getElementsByTagName('span');
	spanEl[characterIndex].style.cssText = STYLE.CURRENT_CHARACTER;
}

function chooseParagraph() {
	const random = Math.floor(Math.random() * PARAGRAPHS.length);
	selectedParagraph = PARAGRAPHS[random].split('');
	selectedParagraph.forEach((char) => {
		spanEl = document.createElement('span');
		spanEl.innerText = char;
		gameStartMessageEl.appendChild(spanEl);
	});
}

function startTyping() {
	document.addEventListener('keydown', gameLogic);
}

function gameLogic(event) {
	event.preventDefault();

	const pressedKey = event.key;
	const pressedKeyCode = event.keyCode;
	const characterKey = spanEl[characterIndex].innerText;
	const characterKeyCode = characterKey.charCodeAt(0);

	if (pressedKeyCode == 16) {
		shiftKeyPressCount = 1; // If shift key press one time mean's user want to write first capital latter
	} else if (
		shiftKeyPressCount === 1 &&
		pressedKeyCode === characterKeyCode
	) {
		forRightCharacter(); // Capital letter condition
	} else if (pressedKey === characterKey) {
		forRightCharacter(); // Small letter condition
	} else if (pressedKey !== characterKey) {
		forWrongCharacter(); // Wrong letter condition
	}
}

function forRightCharacter() {
	spanEl[characterIndex].style.cssText = STYLE.RIGHT_CHARACTER;
	forNextCharacter();
}

function forWrongCharacter() {
	if (spanEl[characterIndex].innerText === ' ') {
		spanEl[characterIndex].style.cssText = STYLE.WRONG_SPACE;
	} else {
		spanEl[characterIndex].style.cssText = STYLE.WRONG_CHARACTER;
	}
	errorCount++;
}

function forNextCharacter() {
	shiftKeyPressCount = 0;
	characterIndex++;

	if (spanEl[characterIndex] !== undefined) {
		spanEl[characterIndex].style.cssText = STYLE.CURRENT_CHARACTER;
	} else {
		// If you reach last character then game finish.
		forGameFinish();
	}
}

function forGameFinish() {
	document.removeEventListener('keydown', gameLogic);
	gameStartButtonEl.children[0].innerHTML = BUTTON_NAMES.RESTART;
	gameStartButtonEl.removeAttribute('disabled');

	const date = new Date();
	endTime = date.getTime();
	const MILLISECONDS = 1000;
	const SECONDS = 60;
	const WORD_LENGTH = 5;

	// WPM (words per minutes)

	// total time in minutes
	const totalTime = (endTime - startTime) / MILLISECONDS / SECONDS;
	const totalWords = selectedParagraph.length / WORD_LENGTH;
	const grossWPM = totalWords / totalTime;
	const netWords = totalWords - errorCount;
	const netWPM = netWords / totalTime;
	const accuracy = (netWPM / grossWPM) * 100;

	userTypingSpeedEl.innerHTML = netWPM.toFixed(0);
	userTypingErrorsEl.innerHTML = errorCount;
	userTypingAccuracyEl.innerHTML = `${accuracy.toFixed(2)}%`;
	userTypingTimeEl.innerHTML = totalTime.toFixed(2);

	gameStartDivEl.classList.add('d-none');
	gameFinishDivEl.classList.remove('d-none');
	gameFinishDivEl.classList.add('d-flex');
	gameFinishDivEl.classList.add('d-none');

	// Below values store for certificate
	localStorage.setItem(LOCAL_STORAGE_KEYS.SPEED, netWPM.toFixed(0));
	localStorage.setItem(LOCAL_STORAGE_KEYS.ACCURACY, accuracy.toFixed(2));
}
