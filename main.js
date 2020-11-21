let rez = document.getElementById('results');
let digits = document.getElementsByClassName('digit');
let ops = document.getElementsByClassName('operation');
let h = document.getElementsByClassName('history')[0];
let ms = document.getElementById('ms');

let digits_arr = [];
let ops_arr = [];
let signs = ['+', '-', 'x', '/', '!'];
let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let input_nr = '';
let mem = '';
let history_html = '';

// --- start --- EVENT HANDLERS pt proprietatea de onclick -----

for (let i = 0; i < digits.length; i++) {
	digits[i].onclick = function(ev) {
		rez.innerText += ev.target.innerText;
		// Atata timp cat dupa cifra nu avem semn, 'appenduim' la variabila input_nr (ex: nu stim inca daca vrem 9 sau 999)
		// Altfel, se declanseaza event de click pt semn iar abia acolo impingem nr in array de nr
		input_nr += ev.target.innerText;		
	}
}

for (let i = 0; i < ops.length; i++) {
	ops[i].onclick = function(ev) {
		// daca avem un nr care asteapta sa fie salvat, salvam si golim variabila
		if (input_nr) {
			digits_arr.push(Number(input_nr));
			input_nr = '';
		}
		// getionare caz cand userul apasa direct semn (fara nici un nr in prealabil) 
		if (digits_arr.length == 0) {
			return;
		}
		// gestionare caz cand se apasa semn dupa semn (suprascriem ultimul semn)
		if (ops_arr.length == digits_arr.length) {
			ops_arr[ops_arr.length - 1] = ev.target.innerText;
			rez.innerText = rez.innerText.substr(0, rez.innerText.length - 1) + ev.target.innerText;
		} else {
			rez.innerText += ev.target.innerText;
			ops_arr.push(ev.target.innerText);
		}
		if (ev.target.innerText == '!') {
			digits_arr.push(1); // conform nota fct calcul()
		}
		if (ev.target.innerText == '=') {
			calcul();
		}
	}
}

document.getElementById('clear').onclick = function(ev) {
	rez.innerText = '';
	digits_arr = [];
	ops_arr = [];
}

document.getElementById('ms').onclick = function(ev) {
	if (digits_arr.length == 1) { // daca avem un singur nr sau un total
		mem = digits_arr[0];
		ms.classList.add('saved');
	}
}

document.getElementById('mc').onclick = function(ev) {
	mem = '';
	ms.classList.remove('saved');
}

document.getElementById('mr').onclick = function(ev) {
	if (mem != '') {
		rez.innerText += mem;
		digits_arr.push(mem);
	}
}

document.getElementById('bak').onclick = function(ev) {
	let last_char = rez.innerText[rez.innerText.length - 1];
	//console.log(last_char);
	// daca ultimul caracter este semn, il scoatem din arr de semne
	// altfel este nr (care inca nu a fost salvat), si stergem ultima cifra
	if (ops_arr.includes(last_char)) {
		ops_arr.pop();
	} else if (input_nr) {
		input_nr = input_nr.substr(0, input_nr.length - 1);
	}
	rez.innerText = rez.innerText.substr(0, rez.innerText.length - 1);
}
	


h.onclick  = function(ev) {
	h.classList.toggle('expand');
	if (h.classList.contains('expand')) {
		h.innerHTML = history_html;
	} else {
		h.innerHTML = 'H<br>I<br>S<br>T<br>O<br>R<br>Y<br>';
	}
}

// ------------- end onclick ----------

function calcul() {
	/* Array-ul de nr va avea lungimea cu +1 mai mare decat array-ul de semne
	Astfel, initializam total cu primul nr, si parcurgem de la i=1 pt nr, j=0 pt semne
	In cazul factorial, ne-ar mai trebui un element cu care sa "facem operatia", de aceea am adaugat inca un
	element cu valoarea 1 (putea fi oricare) in eventul de onclick pt operation*/
	if (digits_arr.length == 0) {
		return; // suprimam o eroare de 'undefined' cand se apasa direct '='
	}	
	let total = digits_arr[0];
	let j = 0;
	for (let i = 1; i < digits_arr.length; i++) {
		switch(ops_arr[j]) {
			case '+' : total += digits_arr[i]; break;
			case '-' : total -= digits_arr[i]; break;
			case 'x' : total *= digits_arr[i]; break;
			case '/' : total /= digits_arr[i]; total = Number(total.toFixed(2)); break;
			case '!' : total = factorial(total); break;
		}
		//console.log(total);
		j++;	
	}
	// Mutam output in history
	rez.innerText += total;
	history_html += rez.innerText + '<hr>';
	// Dupa "=" tinem minte doar rezultatul si golim arr de semne
	digits_arr = [total];
	ops_arr = [];
	rez.innerText = total;
}

function factorial(n) {
	if (isNaN(n) || (n % 1 !== 0)) {
		rez.innerText = '';
		return `${n} is not an integer!`;
	}
	if (n > 10) { // ca sa nu crape
		rez.innerText = '';
		return `${n} este prea mare pt a afisa factorialul !`;
	}
	let fact = 1;
	for (let i = 1; i <= n; i++) {
		fact *= i;
	}
	return fact;	
}