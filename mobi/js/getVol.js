var GetQueryString = require('./GetQueryString').GetQueryString;

exports.vol = function(){
	var vol = GetQueryString('vol')?GetQueryString('vol'):0;
	return vol;
}