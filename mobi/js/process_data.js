var removeHTMLTag = require('./remove_html_tag').removeHTMLTag;
var setData = require('./set_data').setData;
var volMaga = require('./vol_maga').volMaga();
var category = require('./category').category();
var throttle = require('./throttle').throttle;
var pageLoadFunc = require('./page_load').pageLoad;
var jumpHref = require('./jumpHref').jumpHref;
var dataFilter = require('./search').dataFilter;
var gqs = require('./GetQueryString').GetQueryString;

exports.processData = function(data){
	var dataRev = data.reverse(), 
		dataCont = [], 
		patch = 5, 
		dataTemp = [], 
		latestVol = volMaga.pop(), 
		detailId = gqs('id');

		dataCont = setData(dataRev);
		dataTemp = dataCont.slice(0, patch);

	var vue = new Vue({
		el: '#magaList', 
		data: {
			keyword: '', 
			keywords: [], 
			list: dataTemp, 
			latest: latestVol, 
			curPage: 1, 
			catObj: category, 
			detailId: detailId
		}, 
		computed: {
			latestUrl: function(){
				return jumpHref('maga.html?vol='+this.latest.vol);
			}, 

			dataHolder: function(){
				var temp = [];
				dataRev.forEach(function(item, idx){
					var itemTemp = {
							classify: '', 
							desc: '', 
							keywords: '', 
							grade_creativity: '', 
							grade_difficulty: '', 
							pre: '', 
							title: ''
						};
					for(var key in item){
						switch(key) {
							case "type":
								item[key].forEach(function(type, tidx){
									if(typeof type == 'string'){
										itemTemp.classify += type + ' ';
									}
								});
								break;
							case "vd":
								itemTemp.keywords = item[key].join(',');
								break;
							case "fe": 
								itemTemp.grade_creativity = item[key][0];
								itemTemp.grade_difficulty = item[key][1];
								break;
							case "desc": 
								itemTemp.pre = item[key];
								break;
							case "title": 
								itemTemp.title = item[key];
								break;
						}

					}

					temp.push(itemTemp);
				});

				return temp;
			}, 

			detailObj: function(){
				var temp = {};
				dataRev.forEach(function(item, idx){
					if(item._id == detailId) {
						for(var key in item){
							temp[key] = item[key];
						}
					}
				});
				return temp;
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
				this.list = dataCont.slice(0, end);
			}, 
			search: function(e){
				var self = this,
					s,  
					cat = (s = e.target.getAttribute('data-category')) ? s : '', 
					text = this.keyword ? this.keyword.split(' ') : e.target.innerText;

				this.list = [];

				self.curPage = 0;

				if(cat !== 'all'){
					dataCont = dataRev.filter(function(item, idx){
						return dataFilter(self.dataHolder[idx], text, cat);
						});

					dataTemp = dataCont.slice(0, patch);
				}else {
					dataRev.forEach(function(item, idx){
						dataCont[idx] = item;
					});
					dataTemp = dataCont.slice(0, patch);
				}

				this.keywords = (typeof text == 'string') ? [text] : text;
				self.list = dataTemp;

				set.hideMenu();
				set.toTop();
			}
		}
	});
}