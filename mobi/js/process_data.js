var removeHTMLTag = require('./remove_html_tag').removeHTMLTag;
var setData = require('./set_data').setData;
var category = require('./category').category();
var throttle = require('./throttle').throttle;
var pageLoadFunc = require('./page_load').pageLoad;
var jumpHref = require('./jumpHref').jumpHref;
var dataFilter = require('./search').dataFilter;
var gqs = require('./GetQueryString').GetQueryString;
var lazyLoad = require('./lazyload_vue.js').lazyLoad;
var wxShare = require('./share').wxShare();

exports.processData = function(data){
	var dataRev = data.reverse(), 
		dataCont = [], 
		patch = 5, 
		dataTemp = [], 
		latestVol = volMaga.slice(-1)[0], 
		linkKey = gqs('key'), 
		linkCat = gqs('cat'), 
		detailId = gqs('id');

		dataCont = setData(dataRev);
		dataTemp = dataCont.slice(0, patch);


	var vue = new Vue({
		el: '#magaList', 
		data: {
			keyword: '', 
			keywords: [], 
			listAll: dataCont, 
			list: dataTemp, 
			latest: latestVol, 
			curPage: 1, 
			catObj: category, 
			detailId: detailId
		}, 
		compiled: function(){
			var self = this;

			if(!detailId && !(linkKey || linkCat)){
				wxShare(jumpHref('img/share_3.0.png'),100,100,location.href,'拇指期刊案例合集');
			}

			(linkKey || linkCat) && self.search();
		}, 
		ready: function(){
			lazyLoad();
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
				if(detailId){
					var temp = {};
					dataRev.forEach(function(item, idx){
						if(item._id == detailId) {
							for(var key in item){
								temp[key] = item[key];
							}
						}
					});

					wxShare('https:'+temp.image,100,100,location.href,temp.title,removeHTMLTag(temp.links[0].url));

					document.title = temp.title + ' - 拇指期刊';
					return temp;
				}
			}, 

			curVol: function(){
				var vol = 0;
				detailId && volMaga.forEach(function(item, idx){
					var pt = item.date.split('-'), 
						projectTime = new Date(parseInt(pt[0]), parseInt(pt[1])-1, parseInt(pt[2])).toISOString();

					if(projectTime == this.detailObj.projectTime){
						vol = item.vol;
					}
				}.bind(this));

				return vol;
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
					cat = linkCat ? linkCat : e && (s = e.target.getAttribute('data-category')) ? s : '', 
					text = linkKey ? linkKey.split(',') : !!self.keyword ? self.keyword.trim().split(' ') : e.target.getAttribute('data-key').split(' '), 
					pageTitle = '';

				self.list = [];

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

				self.keywords = text;
				self.listAll = dataCont;
				self.list = [];

				setTimeout(function(){
					self.list = dataTemp;
					if(self.keyword){
						document.querySelector('.menu_search_input').value = '';
						document.querySelector('.menu_search_input').blur();
					}
				}, 200);

				set.hideMenu();
				set.toTop();

				linkKey = linkCat = '';
				pageTitle = '拇指期刊-“' + text.join(', ') + '”的搜索结果';

				dataTemp[0] && wxShare('https:'+dataTemp[0].image,100,100,jumpHref('maga_list.html?key='+text.join(',')+'&cat='+cat),pageTitle,'拇指期刊案例合集');
				document.title = pageTitle;
			}
		}
	});
}