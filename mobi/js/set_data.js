var removeHTMLTag = require('./remove_html_tag').removeHTMLTag;

exports.setData = function(data){
	data.forEach(function(item, idx){
		for(var key in item){
			switch(key){
				case "_id": 
					data[idx].magaDetail = ''+'?id=' + item[key];
					break;
				case "type": 
					var temp = item[key];
						data[idx][key] = [];
					temp.forEach(function(type, tidx){
						if(tidx > 0){
							data[idx][key].push(type.name);
						}
					});
					break;
				case "links":
					var temp = '';
					item[key].forEach(function(url, uidx){
						temp += url.url;
					});
					data[idx][key] = removeHTMLTag(temp);
					temp = data[idx][key];
					data[idx].magaLinkShort = temp.split('').splice(0, 200).join('') + '...';
					break;
				case "vd":
					data[idx][key] = item[key].split(',');
					break;
				case "fe":
					data[idx].magaStar = [];
					data[idx][key] = item[key].split(',');
					data[idx][key].forEach(function(si, sidx){
						if(sidx < 2){
							var star = '★', 
								snum = parseInt(si), 
								starStr = '';
							for(var i=0; i<snum; i++){
								starStr += star;
							}
							data[idx].magaStar.push(starStr);
						}
					});
					break;
			}
		}
	});
	return data;
};