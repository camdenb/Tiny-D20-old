window.onload = init;
var advancedIsShown = false;
var advancedStartsOpen = false;
var timesUsed = 0;

function init() {
	document.getElementById("roll").onclick = rollDice;
	hideAdvanced()
	document.getElementById("adv-button").onclick = toggleAdvanced;
	document.getElementById("adv-button").disabled = true;
	updatePrefs();
}

function generateTable(arr, nat_max) {
	var table = document.getElementById("results-table");
	
	//clear table first
	table.innerHTML = "";
	
	//populate table from array - VERTICAL
	for (var i = arr.length - 1; i >= 0; i--) {

		var num = arr[i];
		var newRow = table.insertRow(0);

		//count column
		var countCell = newRow.insertCell(0);
		countCell.innerHTML = i + 1;

		//roll column
		var rollCell = newRow.insertCell(-1);
		rollCell.innerHTML = num;

		if(num == nat_max) {
			rollCell.className += " nat-max";
		} else if(num == 1) {
			rollCell.className += " nat-min";
		}

	};
	
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
	document.getElementById("adv-button").disabled = false;

	if(advancedStartsOpen) {
		showAdvanced();
	}

	updateTimesUsed();

	updateAdvancedArea(rollArray, sides);
}

function updateTimesUsed() {
	var newValue = 0;
	if(timesUsed !== undefined && timesUsed !== null) {
		newValue = timesUsed + 1
		timesUsed = newValue;
	}
	chrome.storage.sync.set({
	    "timesUsed": newValue
	});

}

function updatePrefs() {
	chrome.storage.sync.get(null, function(obj) {
		advancedStartsOpen = obj.advancedStartsOpen;
		timesUsed = obj.timesUsed;
	});
}

function updateAdvancedArea(rollArray, nat_max) {
	generateTable(rollArray, nat_max);
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

function setMinAndMax(_min, _max) {
	var min = document.getElementById("minmax-table-min");
	var max = document.getElementById("minmax-table-max");

	min.innerHTML = _min;
	max.innerHTML = _max;
}

//https://gist.github.com/kerimdzhanov/7529623
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function toggleAdvanced() {
	console.log('toggling')
	if(advancedIsShown) {
		hideAdvanced();
	} else {
		showAdvanced();
	}
}

function showAdvanced() {
	document.getElementById("advanced").style.display = "";
	advancedIsShown = true;
}

function hideAdvanced() {
	document.getElementById("advanced").style.display = "none";
	advancedIsShown = false;
}
