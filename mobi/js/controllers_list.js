// author: EC
// last modify: 2016-6-23 14:44

var processData = require('./process_data').processData;

window.json2 = function(){
	var args = arguments[0];
		var si = setInterval(function(){
			if(volMaga){
				processData(args);
				clearInterval(si);
			}
		}, 200);
	};