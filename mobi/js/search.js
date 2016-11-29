exports.dataFilter = function(data, keywords, category){
	var keys = (category == 'grade_creativity' || category == 'grade_difficulty') ? keywords[0][keywords[0].search(/\d/)].split('') : (typeof keywords == 'string') ? keywords.split(' ') : keywords, 
		boo = 0, 
		dataTemp = {};

	if(typeof data == 'string'){
		dataTemp.text = data;
		data = dataTemp;
	}

	if(typeof data == 'array'){
		data.forEach(function(item, idx){
			if(typeof item == 'string'){
				dataTemp['text' + idx] = item;
			}else if(item[0]){
				dataTemp['text' + idx] = item.join(',');
			}else{
				console.log('the type of data is not suitable to filter');
			}
		});
		data = dataTemp;
	}

	for(var key in data){
		if(!category || (category && category == key)){
			keys.forEach(function(ai, aidx){
				var re = new RegExp(ai, "i");
					reg = data[key].search(re) >= 0 ? 1 : 0;

				boo = boo || reg;
			});
		}
	}
	
	return boo;
}