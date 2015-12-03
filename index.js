/* 
 * Library file providing API for the dependency-tracker module.
 */

// Required Node Modules
var ls = require('npm-remote-ls').ls2;
var async = require('async');
var fs = require('graceful-fs');
//var fd = require('formatdragon');
//var fl = require('filterdragon');

// Usage: depTracker (<path to package.json>, <flag value>, <path to filter.json>)
exports.depTracker = function (ipack, val, name, callback) {

// Package Variables
var pack = require(ipack);
var deps = pack.dependencies;
var depStr = JSON.stringify(deps);
var depLst = depStr.substring(1, depStr.length - 1).split(",");

// Internal Variables
var uniqueList = [];
var completeList = [];
var outputTail = ''; 
var uniqueCount = 0;
var modcount = 0;
var count = 0;


function readJsonFileSync(filepath, encoding){
    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}


// Finds the configuration file.
function getConfig(file){

    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}


// Writes to logger file.
function consoler(msg) {
	fs.appendFileSync(name, msg + '\n');
}


// Checks if an item is contained within an array.
function contains(arr, item) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            return true;
        }
    }
    return false;
}


// Sorts the array of unique dependencies alphabetically.
function listAlphabetical (array) {
	array.sort();
	for (x = 1; x < array.length; x++) {
		consoler("  ├─" + array[x]);
	}
}


// Replaces every second occurrence of a specific character.
function replaceSecond(input) {

}


// Swaps two elements in an array.
function swap(array, firstIndex, secondIndex){
    var temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
}


// Generic partition function.
function partition(array, left, right) {
    var pivot   = array[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;

    while (i <= j) {
        while (array[i][1] > pivot[1]) {
            i++;
        }
        while (array[j][1] < pivot[1]) {
            j--;
        }
        if (i <= j) {
            swap(array, i, j);
            i++;
            j--;
        }
    }
    return i;
}


// Sorting algorithm.
function quickSort(array, left, right) {
    var index;
    if (array.length > 1) {
        index = partition(array, left, right);
        if (left < index - 1) {
            quickSort(array, left, index - 1);
        }
        if (index < right) {
            quickSort(array, index, right);
        }
    }
    return array;
}


//Check if the item is existed in the array of the array.
function existed(array, item) {
	var len = array.length;
	for (var i = 0; i < len; i++) {
		if (item === array[i][0]) return true;
	}
	return false;
}

// How many times each module have been used in the array passed in.
function sortUnique(depArray) {
	var len = depArray.length;
	var newArray = [];
	for (var i = 0; i < len; i++) {
		var sample = depArray[i];
		var counter = 0;
		for (var j = i; j < len; j++) {
			if (depArray[j] === sample) {
				counter++;
			}
		}
		if (!existed(newArray, "\n" + depArray[i])) {
			newArray.push(["\n" + depArray[i], "  " + counter]);
		}
	}
	//console.log("sortUnique result:\n" + newArray);
	return newArray;
}


// Returns a flattened list of the dependencies for the given node module with the latest version.
function listLatestAll (dep, callback) {
	ls(dep, 'latest', true, function(obj) {
		var objArray= obj.toString().split(",");
		for (i = 0; i < objArray.length; i++) {
	  		newObj = objArray[i].split("@");
 	 		objArray[i] = newObj[0];
	  	}
	  	for (x = 1; x < objArray.length; x++) {
 	 		if (!contains(uniqueList, objArray[x])) {
  				uniqueList.push(objArray[x]);
  				uniqueCount++;
  			}
  		}
  		count++;
  		callback();
	});
}


// Returns a flattened list of the dependencies for the given node module with the specified version.
function listVersionAll (dep, version, callback) {
	ls(dep, version, true, function(obj) {
		var objArray= obj.toString().split(",");
		for (i = 0; i < objArray.length; i++) {
	  		newObj = objArray[i].split("@");
 	 		objArray[i] = newObj[0];
	  	}
	  	for (x = 1; x < objArray.length; x++) {
 	 		if (!contains(uniqueList, objArray[x])) {
  				uniqueList.push(objArray[x]);
  				uniqueCount++;
  			}
  		}
  		count++;
  		callback ();
	});
}


// Returns a flattened list of the dependencies for every node module with
//    each version of the same module treated as a unique dependency.
function listNoCutAll (dep, version, callback) {
	ls(dep, 'latest', true, function(obj) {
		var objArray= obj.toString().split(",");
	  	for (x = 1; x < objArray.length; x++) {
 	 		if (!contains(uniqueList, objArray[x])) {
  				uniqueList.push(objArray[x]);
  				uniqueCount++;
  			}
  		}
  		count++;
  		callback ();
	});
}


// Returns a dependency graph for the given node module with the latest version.
function listLatestEach (dep, callback) {
	ls(dep, 'latest', true, function(obj) {
		var objArray= obj.toString().split(",");
		ls (dep, 'latest', function(obj) {
			consoler("Module: " + dep);
			consoler(JSON.stringify(obj, null, 1));
  			consoler("Total unique dependencies: " + objArray.length);
  			consoler("________________________________________" + "\n");
  			count++;
  			callback();
		});
	});
}


// Returns a dependency graph for the given node module with the specified version.
function listVersionEach (dep, version, callback) {
	ls(dep, version, true, function(obj) {
		var objArray= obj.toString().split(",");
		ls (dep, version, function(obj) {
			consoler("Module: " + dep);
			consoler(JSON.stringify(obj, null, 1));
  			consoler("Total unique dependencies: " + objArray.length);
  			consoler("________________________________________" + "\n");
  			count++;
  			callback();
		});
	});
}


// Returns a complete flattened list of all the dependencies of the latest version of every module.
function listLatestComplete (dep, callback) {
	ls(dep, 'latest', true, function(obj) {
		var objArray= obj.toString().split(",");
		for (i = 0; i < objArray.length; i++) {
	  		newObj = objArray[i].split("@");
 	 		objArray[i] = newObj[0];
	  	}
	  	for (x = 1; x < objArray.length; x++) {
 	 		completeList.push(objArray[x]);
  		}
  		count++;
  		callback();
	});
}


// Returns a complete flattened list of all the dependencies of the indicated version of every module.
function listVersionComplete (dep, version, callback) {
	ls(dep, version, true, function(obj) {
		var objArray= obj.toString().split(",");
		for (i = 0; i < objArray.length; i++) {
	  		newObj = objArray[i].split("@");
 	 		objArray[i] = newObj[0];
	  	}
	  	for (x = 1; x < objArray.length; x++) {
 	 		completeList.push(objArray[x]);
  		}
  		count++;
  		callback();
	});
}


// Lists the number of how many times the modules have been used in the dependency array from the most often to the least.
function listByCount(depArray) {
	var newArray = sortUnique(depArray);
	var len = newArray.length;
	return (quickSort(newArray, 0, len - 1));
}

//output usages
function helpText() {

       console.log("List of valid options"); 
       console.log("======================"); 
 		  console.log("   latest-all outputs a unique flattened list containing the dependencies of the latest version of every module in the package.json.");
		  console.log("   version-all outputs a unique flatted list containing the dependencies of the indicated version of every module in the package.json.");
		  console.log("   latest-each outputs a dependency graph of the latest version of every module in the package.json.");
		  console.log("   version-each outputs a dependency graph of the indicated version of every module in the package.json.");
		  console.log("   latest-count outputs a unique flattened list of dependencies sorted by appearances based on the latest version of every module in package.json.");
		  console.log("   version-count outputs a unique flattened list of dependencies sorted by appearances based on the indicated version of every module in package.json.");
		  console.log("   lalpha-count outputs an alphabetized flattened list of all the dependencies (latest version) and their respective number of appearances."); 
		  console.log("   valpha-count outputs an alphabetized flattened list of all the dependencies (indicated version) and their respective number of appearances.");
		  console.log("   latest-nocut outputs a unique flattened list containing te dependencies of every module (where each version is considered different) in the package.json.");  
		  console.log("   version-nocut outputs a unique flattened list containing te dependencies of every module (where each version is considered different) in the package.json.");
}


// Main Execution
//process.argv.forEach (function (val, index, array) {
	//console.log (val);
	
	// Returns flattened list with latest versions.
	if (val === "latest-all") {
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var newDep = depLst[count].split(":")[0].replace(/"/g, "");
					listLatestAll(newDep, callback);
			},
			function(err) {
				consoler("All Modules (Latest-All)");
				consoler("____________________");
				listAlphabetical(uniqueList);
  				consoler("  └─Total: " + uniqueCount);
  				fd.formatOutput(outputTail);
  				console.log("Saved output to output" + outputTail + ".txt.");
			}
		);
	}
	// Returns a modularized list with latest versions.
	else if (val === "latest-each") {
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var line = depLst[count].split(":");
					var newDep = line[0].replace(/"/g, "");
					var version = line[1].substring(2, line[1].length - 1).replace(/"/g, "");
					listLatestEach(newDep, callback);
			},
			function(err) {
				consoler("Total number of modules: " + count);
  				console.log("Saved output to output" + outputTail + ".txt.");				
			}
		);
	}
	// Returns a modularized list with indicated versions.
	else if (val === "version-each") {
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var line = depLst[count].split(":");
					var newDep = line[0].replace(/"/g, "");
					var version = line[1].substring(2, line[1].length - 1).replace(/"/g, "");
					listVersionEach(newDep, version, callback);
			},
			function(err) {
				consoler ("Total number of modules: " + count);
  				console.log("Saved output to output" + outputTail + ".txt.");					
			}
		);
	}
	// Returns counted list with indicated versions.
	else if (val === "latest-count") {
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var newDep = depLst[count].split(":")[0].replace(/"/g, "");
					listLatestComplete(newDep, callback);
			},
			function(err) {
				consoler ("All Modules (Latest-Count)");
				consoler (listByCount(completeList).toString());
  				console.log("Saved output to output" + outputTail + ".txt.");	
			}
		);
	}
	// Returns counted list with indicated versions.
	else if (val === "version-count") {
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var line = depLst[count].split(":");
					var newDep = line[0].replace(/"/g, "");
					var version = line[1].substring(2, line[1].length - 1).replace(/"/g, "");
					listVersionComplete(newDep, version, callback);
			},
			function(err) {
				consoler ("All Modules (Version-Count)");
				consoler (listByCount(completeList).toString());
  				console.log("Saved output to output" + outputTail + ".txt.");	
			}
		);
	}
	// Returns counted list with latest versions in alphabetical order.
	else if (val === "lalpha-count") {
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var line = depLst[count].split(":");
					var newDep = line[0].replace(/"/g, "");
					var version = line[1].substring(2, line[1].length - 1).replace(/"/g, "");
					listLatestComplete(newDep, callback);
			},
			function(err) {
				consoler ("All Modules (LAlpha-Count)");				
				consoler(listByCount(completeList).sort(
					function(a, b) {
						return a[0].localeCompare(b[0]);
					}).toString());
  				console.log("Saved output to output" + outputTail + ".txt.");					
			}
		);
	}
	// Returns counted list with indicated versions in alphabetical order.
	else if (val === "valpha-count") {
		async.whilst(
			function () {
				return count < 1;
			},
			function(callback) {
					var line = depLst[count].split(":");
					var newDep = line[0].replace(/"/g, "");
					var version = line[1].substring(2, line[1].length - 1).replace(/"/g, "");
					listVersionComplete(newDep, version, callback);
			},
			function(err) {
				consoler ("All Modules (VAlpha-Count)");				
				consoler(listByCount(completeList).sort(
					function(a, b) {
						return a[0].localeCompare(b[0]);
					}).toString());
  				console.log("Saved output to output" + outputTail + ".txt.");		
			}
		);
	}
	// Returns flattened list with each version treated as unique module.
	else if (val === "latest-nocut") {
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var line = depLst[count].split(":");
					var newDep = line[0].replace(/"/g, "");
					var version = line[1].substring(2, line[1].length - 1).replace(/"/g, "");
					listNoCutAll(newDep, version, callback);
			},
			function(err) {
				consoler ("All Modules (Latest-NoCut)");
				consoler("____________________");
				listAlphabetical(uniqueList);
  				consoler("  └─Total: " + uniqueCount);
  				console.log("Saved output to output" + outputTail + ".txt.");
			}
		);
	} 	
	// Returns flattened list with each version treated as unique module.
	else if (val === "version-nocut") {
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var line = depLst[count].split(":");
					var newDep = line[0].replace(/"/g, "");
					var version = line[1].substring(2, line[1].length - 1).replace(/"/g, "");
					listNoCutAll(newDep, 'latest', callback);
			},
			function(err) {
				consoler ("All Modules (Version-NoCut)");
				consoler("____________________");
				listAlphabetical(uniqueList);
  				consoler("  └─Total: " + uniqueCount);
  				console.log("Saved output to " + name + ".txt.");
  				callback(null, outputTail);
			}
		);
	} 	
	// Returns flattened list with indicated versions.
	else if (val === "version-all") {
		noFlag = true;
		async.whilst(
			function () {
				return count < depLst.length;
			},
			function(callback) {
					var line = depLst[count].split(":");
					var newDep = line[0].replace(/"/g, "");
					var version = line[1].substring(2, line[1].length - 1).replace(/"/g, "");
					listVersionAll(newDep, version, callback);
			},
			function(err) {
				consoler ("All Modules (Version-All)");
				consoler("____________________");
				listAlphabetical(uniqueList);
  				consoler("  └─Total: " + uniqueCount);
  				console.log("Saved output to output" + outputTail + ".txt.");
			}
		);
	} 
	// Returns user instructions and support.
	else if (val=== "help") {   
              helpText();
    } 

}