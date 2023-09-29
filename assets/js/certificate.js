import { LOCAL_STORAGE_KEYS } from './constants.js';
import {
	userNameEl,
	userSpeedEl,
	userAccuracyEl,
	certificateDivEl,
	certificateDateEl,
	certificatePrintButtonEl,
} from './dom-elements.js';

const userName = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME);
const userSpeed = localStorage.getItem(LOCAL_STORAGE_KEYS.SPEED);
const userAccuracy = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCURACY);

const date = new Date();
const DD = date.getDate();
const YYYY = date.getFullYear();
let MM = date.getMonth() + 1;
MM = MM < 10 ? `0${MM}` : MM;

const certificateDate = `${DD}/${MM}/${YYYY}`;
certificateDateEl.innerHTML = certificateDate;

if (userName) userNameEl.innerHTML = userName;
if (userSpeed) userSpeedEl.innerHTML = ` ${userSpeed}WPM `;
if (userAccuracy) userAccuracyEl.innerHTML = ` ${userAccuracy}% `;

certificatePrintButtonEl.addEventListener('click', printCertificate);

export function printCertificate() {
	const oldBoy = document.body.innerHTML;
	const certificateBody = certificateDivEl.outerHTML;
	document.body.innerHTML = certificateBody;
	window.print();

	document.body.innerHTML = oldBoy;
}
