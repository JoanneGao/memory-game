
const myList = document.querySelectorAll('li.card');
const myMove = document.querySelector('span.moves');
const restart = document.querySelector('.restart');
const restartButton = document.querySelector('button');

let lastClick = null;
let clickCount = 0;
let matchCount = 0;
let isInTimeout = false;
let starCount = 0;
let elapsedTimeInSeconds = 0;
let myTimer = 0;


const cards = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
const pics = [
	'fa-bolt',
	'fa-paper-plane-o',
	'fa-anchor',
	'fa-cube',
	'fa-leaf',
	'fa-bicycle',
	'fa-diamond',
	'fa-bomb'
 ];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function startGame() {
	shuffle(cards);

	lastClick = null;
	clickCount = 0;
	matchCount = 0;
	isInTimeout = false;
	starCount = 3;
	myMove.textContent = '0';
	elapsedTimeInSeconds = 0;
	document.getElementById("time").textContent = 0 + "m" + 0 +"s";

	// Reset stars
	document.querySelector('#star1').className = 'fa fa-star';
	document.querySelector('#star2').className = 'fa fa-star';
	document.querySelector('#star3').className = 'fa fa-star';

	// Hide the End Game Screen
	document.querySelector('.fullScreen').style.visibility = "hidden";

	for (i = 0; i < cards.length; i++ ) {
		let newClass = 'fa ' + pics[cards[i]];
		myList[i].className = 'card';
		myList[i].firstElementChild.className = newClass;
	}
}

startGame();
    

// Set event listeners

restart.addEventListener('click', function() {
	startGame();
});

restartButton.addEventListener('click', function() {
	startGame();
});



function updateTime() {
	++elapsedTimeInSeconds;
	document.getElementById("time").textContent = 
		Math.floor(elapsedTimeInSeconds / 60) + "m" + elapsedTimeInSeconds % 60 + "s" ;

}
		

for (i = 0; i < cards.length; i++ ) {
	myList[i].addEventListener('click', function(e) {
		
		if (isInTimeout == true) {
			return;
		}
		const currentClick = e.currentTarget;
		// ignore matched cards
		if (currentClick.className == 'card match') {
			return;
		}

		clickCount++;
		if (clickCount == 1) {
			myTimer = setInterval(updateTime, 1000);
		}

		currentClick.className = 'card open show';	

		if (clickCount % 2 == 0) {
			// second click
			if (currentClick == lastClick) {
				clickCount--;	
				return;
			}
			if (currentClick.firstElementChild.className == lastClick.firstElementChild.className) {
				// matched!!!
				matchCount++;
				currentClick.className = 'card match';
				lastClick.className = 'card match';
				if (matchCount == 8) {
					
    				clearInterval(myTimer);
					
					setTimeout(function() {
						document.querySelector('.fullScreen').style.visibility = "visible";
						document.querySelector('#endGameTime').textContent = Math.floor(elapsedTimeInSeconds / 60) + "m" + elapsedTimeInSeconds % 60 + "s" ;
						document.querySelector('#endGameMoves').textContent = '' + clickCount;
						document.querySelector('#endGameStars').textContent = '' + starCount;
					}, 300);		
				}
			} else {
				// no match
				isInTimeout = true;
				setTimeout(function() {
					currentClick.className = 'card';
					lastClick.className = 'card';
					isInTimeout = false;
				}, 200);
				
			}
			
		} else {
			// first click
			lastClick = currentClick;
		}

		myMove.textContent = '' + clickCount;

		if (clickCount == 60) {
			document.querySelector('#star1').className = 'fa fa-star-o';
			starCount = 2;
		} else if (clickCount == 120) {
			document.querySelector('#star2').className = 'fa fa-star-o';
			starCount = 1;
		} 

	});
}
