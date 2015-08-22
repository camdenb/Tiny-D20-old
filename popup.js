window.onload = init;
var advancedIsShown = false;
var advancedStartsOpen = false;
var rollAnimation = true;
var macrosList;

var maxTimesToRoll = 17;
var timesToRoll = maxTimesToRoll;
var maxRollTime = 10;
var rollTime = maxRollTime;
var currentlyRolling = false;

var macrosListDiv;

function init() {
	document.getElementById("roll").onclick = rollDice;
	macrosListDiv = document.getElementById('macros_list');
	hideAdvanced()
	document.getElementById("adv-button").onclick = toggleAdvanced;
	document.getElementById("adv-button").hidden = true;
	document.getElementById("options").onclick = openOptions;
	var sides_dom = document.getElementsByName("sides");
	for(var i = 0; i < sides_dom.length; i++){
	    sides_dom[i].addEventListener('click', rollChanged);
	}
	
	document.getElementById("times").addEventListener('input', rollChanged);
	document.getElementById("modifier").addEventListener('input', rollChanged);
	updatePrefs();
	rollChanged();
}

function loadMacrosList() {
	if(macrosList) {
		var newHTML = ""
		for(var i = 0; i < macrosList.length; i++) {
			newHTML += "<input type=button class='macroButton' value='" + macrosList[i].name + " (" + macrosList[i].value + ")' id='macro" + i + "'>";
		}
		macrosListDiv.innerHTML = newHTML;
		initMacroBindings();
	}
}


function initMacroBindings() {
	for(var i = 0; i < macrosList.length; i++) {
		var macroButton = document.getElementById('macro' + i);
		macroButton.onclick = (function(i) {
	      return function() {
	        var detailsArray = macrosList[i].detailsArray;
			rollDiceWithValues(detailsArray[1], detailsArray[2], detailsArray[3], true, true)
	      };
	    })(i);
	}
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
		countCell.innerHTML = "#" + (i + 1);

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

function rollChanged() {
	var arr = getRollsSidesMod();
	var str = arr["rolls"] + "d" + arr["sides"];
	if(arr["mod"] != 0) {
		if(arr["mod"] > 0) {
			str += "+";
		}
		str += parseInt(arr["mod"]);
	}

	var newValue = "Roll " + str + "!";

	if(isNaN(document.getElementById("times").value)
		|| isNaN(document.getElementById("modifier").value)) {
		document.getElementById('roll').disabled = true;
		newValue = "Invalid Roll"
	} else {
		document.getElementById('roll').disabled = false;
	}

	document.getElementById('roll').value = newValue;
}

function getRollsSidesMod() {
	var sides_dom = document.getElementsByName('sides');
	var sides;
	for(var i = 0; i < sides_dom.length; i++){
	    if(sides_dom[i].checked){
	        sides = sides_dom[i].value;
	    }
	}

	var rolls = document.getElementById('times').value;
	var modString = document.getElementById('modifier').value;

	return {"sides":sides, "rolls":rolls, "mod":modString};
}

function rollDiceWithValues(rolls, sides, mod, updateResults, fromButton) {

	var total = 0
	var rollArray = []

	var modNum = parseInt(mod);

	for(var i = 0; i < rolls; i++) {
		var newNum = getRandomInt(1, sides);
		total += newNum
		rollArray.push(newNum)
	}

	if(mod) {
		total += modNum;
	}

	if(rollAnimation) {
		if(fromButton && currentlyRolling) {
			console.log("TRUE");
			resetRollAnimation();
		} else {
			if(timesToRoll > 0) {
				doRollAnimation(rolls, sides, mod);
			} else {
				resetRollAnimation();
			}
		}
	}

	if(updateResults) {
		document.getElementById("result").textContent = total;
		document.getElementById("adv-button").hidden = false;
		
		if(advancedStartsOpen) {
			showAdvanced();
		}

		updateAdvancedArea(rollArray, sides);
	}

	

	return [total, rollArray];
}

function doRollAnimation(rolls, sides, mod) {
	currentlyRolling = true;
	if(timesToRoll == maxTimesToRoll){
		rollTime = maxRollTime;
		document.getElementById("result").className += "temp_roll";
	}
	setTimeout(function() {
		rollDiceWithValues(rolls, sides, mod, true, false);
	}, rollTime);
	rollTime += 10;
	console.log(rollTime);
	timesToRoll -= 1;
}

function resetRollAnimation() {
	currentlyRolling = false;
	document.getElementById("result").className = "";
	clearTimeout()
	timesToRoll = maxTimesToRoll;
	rollTime = maxRollTime;
}

function rollDice() {
	var result = 0

	var dataArr = getRollsSidesMod()

	var sides = dataArr["sides"]

	var rolls = dataArr["rolls"]
	var modString = dataArr["mod"]

	var modifier = parseInt(modString);

	var results = rollDiceWithValues(rolls, sides, modifier, true, true)
}

function updatePrefs() {
	chrome.storage.sync.get(null, function(obj) {
		advancedStartsOpen = obj.advancedStartsOpen;
		macrosList = obj.macroArr;
		rollAnimation = obj.rollAnimation
		loadMacrosList();
	});
}

function openOptions() {
	if (chrome.runtime.openOptionsPage) {
	    // New way to open options pages, if supported (Chrome 42+).
	    chrome.runtime.openOptionsPage();
	} else {
	    // Reasonable fallback.
		window.open(chrome.runtime.getURL('options.html'));
	}
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
	if(rollArray.length == 1) {
		document.getElementById('minmax-table').hidden = true;
	} else {
		document.getElementById('minmax-table').hidden = false;
		setMinAndMax(min, max);
	}
	
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
