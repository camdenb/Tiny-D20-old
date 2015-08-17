window.onload = init;

function init() {
	document.getElementById("color").addEventListener('change', save_options);
	document.getElementById("advStartsOpen").addEventListener('change', save_options);

	loadCurrentValues()	
}

function loadCurrentValues() {
	chrome.storage.sync.get(null, function(obj) {
		if(obj.themeColor !== null && obj.themeColor !== undefined) {
			document.getElementById("color").value = obj.themeColor;
		} else {
			document.getElementById("color").value = "white";
		}

		document.getElementById("advStartsOpen").checked = obj.advancedStartsOpen;
	});
}


// Saves options to chrome.storage.sync.
function save_options() {
  var color = document.getElementById('color').value;
  var isAdvChecked = document.getElementById('advStartsOpen').checked;
  chrome.storage.sync.set({
    "themeColor": color,
    "advancedStartsOpen": isAdvChecked
  });

  chrome.browserAction.setIcon({
  	path: {"19": "icon19-" + color + "-outline.png",
  		   "38": "icon38-" + color + "-outline.png"	}
  });
}