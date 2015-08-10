window.onload = init;
var advancedIsShown = false;

function init() {
	document.getElementById("roll").onclick = rollDice;
	hideAdvanced()
	document.getElementById("adv-button").onclick = toggleAdvanced;
}


function rollDice() {
	var result = 0

	var sides_dom = document.getElementsByName('sides');
	var sides;
	for(var i = 0; i < sides_dom.length; i++){
	    if(sides_dom[i].checked){
	        sides = sides_dom[i].value;
	    }
	}

	var rolls = document.getElementById('times').value;
	var modifier = parseInt(document.getElementById('modifier').value);

	var total = 0;

	for(var i = 0; i < rolls; i++) {
		var newNum = getRandomInt(1, sides);
		total += newNum
	}

	total += modifier;

	document.getElementById("result").textContent = total;
}


//https://gist.github.com/kerimdzhanov/7529623
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function toggleAdvanced() {
	console.log('toggling')
	if(advancedIsShown) {
		hideAdvanced()
	} else {
		showAdvanced()
	}
}

function showAdvanced() {
	document.getElementById("advanced").style.display = "";
	advancedIsShown = true
	// document.getElementById("results-array").textContent = [12, 2, 12, 29].join([separator = ', ']);
}

function hideAdvanced() {
	document.getElementById("advanced").style.display = "none";
	advancedIsShown = false
}
