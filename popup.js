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
	var modString = document.getElementById('modifier').value;

	if (!modString.charAt(0).match(/^[0-9]$/)) {
		if(modString.charAt(0) != "-") {
			modString = modString.substring(1, modString.length);
		}
	}

	var modifier = parseInt(modString);

	var total = 0;

	var rollArray = []

	for(var i = 0; i < rolls; i++) {
		var newNum = getRandomInt(1, sides);
		total += newNum
		rollArray.push(newNum)
	}

	total += modifier;

	document.getElementById("result").textContent = total;

	updateAdvancedArea(rollArray);
}

function updateAdvancedArea(rollArray) {
	refreshAdvancedTextArea(rollArray);
	var min = rollArray[0];
	var max = rollArray[0];
	for(var i = 0; i < rollArray.length; i++) {
		var num = rollArray[i];
		if(Math.max(num, max) == num) {
			max = num;
		}
		if(Math.min(num, min) == num) {
			min = num;
		}
	}
	setMinAndMax(min, max);
}

function setMinAndMax(min, max) {
	document.getElementById("min").value = min;
	document.getElementById("max").value = max;
}

function refreshAdvancedTextArea(arr) {
	document.getElementById("results-array").textContent = "[" + arr.join([separator = ', ']) + "]";
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
}

function hideAdvanced() {
	document.getElementById("advanced").style.display = "none";
	advancedIsShown = false
}
