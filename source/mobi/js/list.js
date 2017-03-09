var json2 = function(){
		testVue(arguments[0]);
	};

	var removeHTMLTag = function(str) {
        str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
        str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
        return str;
    };

    var setData = function(data){
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
    					data[idx][key] = item[key].split(',');
    					data[idx][key].forEach(function(si, sidx){
    						if(sidx < 2){
    							var star = '★', 
    								snum = parseInt(si), 
    								starStr = '';
    							for(var i=0; i<snum; i++){
    								starStr += star;
    							}
    							data[idx][key][sidx] = starStr;
    						}
    					});
    					break;
    			}
    		}
    	});
    	return data;
    };

	var testVue = = function(data){
        var dataRev = data.reverse(), 
            total = dataRev.length, 
            patch = 10, 
            dataTemp = [];

            dataRev = setData(dataRev);
            dataTemp = dataRev.slice(0, patch);
        var vue = new Vue({
            el: '#magaList', 
            data: {
                keyword: '', 
                keywords: [], 
                list: dataTemp
            }, 
            methods: {
                onload: function(e){
                    var target = e.target, 
                        page = parseInt(target.getAttribute('data-page')), 
                        end = 0;

                    page += 1;
                    end = patch*page;
                    if(end > total) {
                        end = total;
                        page = Math.ceil(total / patch);
                        target.style.display = 'none';
                    }
                    target.setAttribute('data-page', page);
                    this.list = dataRev.slice(0, end);
                }, 
                search: function(e){
                    var text = this.keyword.split(' ');

                    dataTemp = dataRev.filter(function(item, idx){
                        var boo = 0, 
                            itemTemp = {
                                type: '', 
                                desc: '', 
                                keywords: '', 
                                grade: '', 
                                pre: ''
                            };
                        for(var key in item){
                            switch(key) {
                                case "type":
                                    item[key].forEach(function(type, tidx){
                                        if(tidx > 0){
                                            itemTemp.type += type.name;
                                        }
                                    });
                                    break;
                                case "vd":
                                    itemTemp.keywords = removeHTMLTag(item[key]);
                                    break;
                                case "fe": 
                                    itemTemp.grade = item[key];
                                    break;
                                case "desc": 
                                    itemTemp.pre = item[key];
                                    break;
                                case "title": 
                                    itemTemp.title = item[key];
                                    break;
                            }
                        }
                        for(var key in itemTemp){
                            text.forEach(function(ai, aidx){
                                var re = new RegExp(ai, "i");
                                    reg = itemTemp[key].search(re) > 0 ? 1 : 0;
                                boo = boo || reg;
                            });
                        }

                        return boo;
                    });

                    this.list = dataTemp;
                }
            }
            
        });
    }