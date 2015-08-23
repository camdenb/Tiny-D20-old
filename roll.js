
document.getElementById('rollButton').onclick = rollTest;

var valid_basic_capturing_re = /^(\d*)[dD](\d*)$/;
var valid_simple_re = /^\d*[dD]\d+.*$/;

//ASSUMING NOT MALFORMED --> CHECK FOR THIS!!!
var expression = "(1d4)d(45d2)*(3+2*5+d20) - 2d10 * 10";

function rollTest() { 
	try {
		document.getElementById('error').innerHTML;
		document.getElementById('result').innerHTML = eval_complex(document.getElementById('value').value)
	} catch(err) {
		document.getElementById('result').innerHTML = 'MALFORMED STRING!!!'
		document.getElementById('error').innerHTML = err;
	}
}

// returns an array of the contents and contents including the container
function getInnermostNest(str, beginChar, endChar) {
	var startIndexOfMatch = 0
	var match;
	for(var i = 0; i < str.length; i++) {
		var char = str.charAt(i);
		if(char == beginChar) {
			startIndexOfMatch = i;
		} else if(char == endChar) {
			break;
		}
	}
	
	return [str.slice(startIndexOfMatch + 1, i), str.slice(startIndexOfMatch, i + 1)]
	
}

function random_num(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function simple_roll(a, x) {
	var total = 0;
	for(var i = 0; i < a; i++){
		total += random_num(1, x);
	}
	return total;
}

// AdX+C
// 1d20-4
function eval_simple(str) {
	
	// first, remove spaces
	str = str.replace(/\s+/g, '');
	
	// exit if string is malformed
	if(valid_simple_re.test(str) == false) {
		return "Nope bad string";
	}
	
	// find roll
	var results = valid_basic_capturing_re.exec(str);
	
	// check for blanks
	if(results[1] == "") {	results[1] = 1;	}
	
	// roll the dice for the extracted num
	var total = simple_roll(results[1], results[2]);
	
	// now replace the dice expression with the new total and eval
	str = str.replace(valid_simple_re, total);
	
	// replace Xs with *s
	str = str.replace(/[xX]/g, "*");
	
	return Math.floor(Parser.evaluate(str));
	
}

// AdX*AdX-AdX+C
// 2d4 + 1d20 x 1d200 * 2
function eval_adv(str) {
	// first, remove spaces
	str = str.replace(/\s+/g, '');
	
	// split by operator
	var arr = str.split(/[\+\-\*\/xX]/);
	
	// eval and replace each simple roll
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].search(/[dD]/) != -1) {
			var result = eval_simple(arr[i]);
			str = str.replace(arr[i], result);
		}
	}
	
	// replace Xs with *s
	str = str.replace(/[xX]/g, "*");
	
	return Math.floor(Parser.evaluate(str));
}

// (AdX+C)dX-C
// (1d4+1)d20 - 2
function eval_complex(str) {
	
	// repeat until no more brackets
	while(str.indexOf('(') != -1) {
		
		// get innermost bracket pair
		var nest = getInnermostNest(str, '(', ')');

		// evaluate contents and roll
		var num = eval_adv(nest[0]);

		// replace brackets with number
		str = str.replace(nest[1], num);
		
	}
	
	return eval_adv(str);

	
}

function string_is_valid(str){}






