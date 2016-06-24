var removeHTMLTag = require('./remove_html_tag').removeHTMLTag;
var setData = require('./set_data').setData;
var volMaga = require('./vol_maga').volMaga();
var throttle = require('./throttle').throttle;
var pageLoadFunc = require('./page_load').pageLoad;
var jumpHref = require('./jumpHref').jumpHref;

exports.processData = function(data){
	var dataRev = data.reverse(), 
		dataCont = dataRev, 
		patch = 5, 
		dataTemp = [], 
		latestVol = volMaga.pop();

		dataRev = setData(dataRev);
		dataTemp = dataRev.slice(0, patch);

	var vue = new Vue({
		el: '#magaList', 
		data: {
			keyword: '', 
			keywords: [], 
			list: dataTemp, 
			latest: latestVol, 
			curPage: 1
		}, 
		computed: {
			latestUrl: function(){
				return jumpHref('maga.html?vol='+this.latest.vol);
			}
		}, 
		methods: {
			onScroll: function(e){
				throttle(pageLoadFunc, 200, 500, this, e)();
			}, 
			pageLoad: function(){
				var page = this.curPage, 
					end = 0,
					total = dataCont.length;

				page += 1;
				end = patch*page;
				if(end > total) {
					end = total;
					page = Math.ceil(total / patch);
					// target.style.display = 'none';
				}
				this.curPage = page;
				this.list = dataRev.slice(0, end);
			}, 
			search: function(e){
				var text = this.keyword.split(' ');

				this.curPage = 0;

				dataCont = dataRev.filter(function(item, idx){
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
								itemTemp.keywords = item[key].join(',');
								break;
							case "fe": 
								itemTemp.grade = item[key].join(',');
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

				this.list = dataTemp = dataCont.slice(0, patch);
				set.hideMenu();
			}
		}
	});
}