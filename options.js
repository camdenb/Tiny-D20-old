window.onload = init;

var btns_edit = document.getElementsByClassName("btn_edit");
var btns_delete = document.getElementsByClassName("btn_delete");
var btn_create = document.getElementsByClassName("btn_create")[0];

var diceNotationRegex = /^(\d+)?d(\d+)([+-]\d+)?$/

var macro_table = document.getElementById('macro_table');
var nameField = document.getElementById('macro_name');
var valueField = document.getElementById('macro_value');

function init() {
	document.getElementById("color").addEventListener('change', save_options);
	document.getElementById("advStartsOpen").addEventListener('change', save_options);
	document.getElementById("rollAnimation").addEventListener('change', save_options);
	nameField.addEventListener('input', createInfoModified);
	valueField.addEventListener('input', createInfoModified);
	createInfoModified();
	loadCurrentValues()	
	bindEvents();
}

function loadCurrentValues() {
	chrome.storage.sync.get(null, function(obj) {
		if(obj.themeColor !== null && obj.themeColor !== undefined) {
			document.getElementById("color").value = obj.themeColor;
		} else {
			document.getElementById("color").value = "white";
		}

		if(obj.macroArr !== null && obj.macroArr !== undefined) {
			loadTableFromArray(obj.macroArr);
		}

		document.getElementById("rollAnimation").checked = obj.rollAnimation;		
		document.getElementById("advStartsOpen").checked = obj.advancedStartsOpen;
	});
}


// Saves options to chrome.storage.sync.
function save_options() {
  var color = document.getElementById('color').value;
  var isAdvChecked = document.getElementById('advStartsOpen').checked;
  var macroArr = saveTableToArray();
  var rollAnimation = document.getElementById('rollAnimation').checked;
  chrome.storage.sync.set({
    "themeColor": color,
    "advancedStartsOpen": isAdvChecked,
    "macroArr": macroArr,
    "rollAnimation" : rollAnimation
  });

  chrome.browserAction.setIcon({
  	path: {"19": "icon19-" + color + "-outline.png",
  		   "38": "icon38-" + color + "-outline.png"	}
  });
}

function Macro(name, value) {
	this.name = name;
	this.value = value;
	this.detailsArray = getInfoFromRegex(value);
}

function saveTableToArray() {
	var macroArr = []
	if(macro_table.rows.length >= 3) {
		for(var i = 1; i < macro_table.rows.length - 1; i++) {
			var macro_name = macro_table.rows[i].cells[0].innerHTML;
			var macro_value = macro_table.rows[i].cells[1].innerHTML;
			var newMacro = new Macro(macro_name, macro_value);
			macroArr.push(newMacro);
		}
	}
	return macroArr;
}

function loadTableFromArray(macroArr) {
	for(var i = 0; i < macroArr.length; i++) {
		var macro = macroArr[i];
		newMacroFromObject(macro);
	}
}

function macroTableModified() {
	save_options();
}

function createInfoModified() {
	if(nameField.value == "" && valueField.value == "") {
		btn_create.value = "Create Macro";
	} else {
		btn_create.value = "Create Macro: " + nameField.value + " (" + valueField.value + ") ";
	}
	if(testInfoFromRegex(valueField.value) == false) {
		btn_create.disabled = true;
	} else {
		btn_create.disabled = false;
	}
}

function unbindEvents() {
  for (var i = 0; i < btns_edit.length; i++) {
    btns_edit[i].onclick = null;
  }

  for (var j = 0; j < btns_delete.length; j++) {
    btns_delete[j].onclick = null;
  }

  btn_create.onclick = null;

}

function bindEvents() {
  for (var i = 0; i < btns_edit.length; i++) {
    btns_edit[i].onclick = (function(i) {
      return function() {
        editMacro(i);
      };
    })(i);
  }

  for (var j = 0; j < btns_delete.length; j++) {
    btns_delete[j].onclick = (function(j) {
      return function() {
        deleteMacro(j);
      };
    })(j);
  }

  btn_create.onclick = createMacro;
}

function rebindEvents() {
  unbindEvents();
  bindEvents();
}

function editMacro(btn_index) {
	var macro_name = macro_table.rows[btn_index + 1].cells[0].innerHTML;
	var macro_value = macro_table.rows[btn_index + 1].cells[1].innerHTML;
	deleteMacro(btn_index);
	populateTextFields(macro_name, macro_value);
	macroTableModified();
}

function populateTextFields(name, value) {
  nameField.value = name;
  valueField.value = value;
}

function deleteMacro(btn_index) {
	macro_table.deleteRow(btn_index + 1);
	rebindEvents();
	macroTableModified();
}

function createMacro() {
	newMacro(nameField.value, valueField.value);
	nameField.value = "";
	valueField.value = "";
	saveTableToArray();
	macroTableModified();
}

function newMacroFromObject(macro) {
	newMacro(macro.name, macro.value)
}

function newMacro(name, value) {
  var newRow = macro_table.insertRow(macro_table.rows.length - 1);
  var nameCell = newRow.insertCell(-1)
  nameCell.innerHTML = name;
  var valueCell = newRow.insertCell(-1)
  valueCell.innerHTML = value;
  var optionsCell = newRow.insertCell(-1)
  optionsCell.innerHTML = "<input type='button' value='Edit' class='btn_edit' /><input type='button' value='Delete' class='btn_delete' />";
  rebindEvents();
}

function getInfoFromRegex(str) {
  var matchArr = diceNotationRegex.exec(str);
  return matchArr;
}

function testInfoFromRegex(str) {
	return diceNotationRegex.test(str)
}














