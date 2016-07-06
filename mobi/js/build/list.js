/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// author: EC
	// last modify: 2016-6-23 14:44

	var processData = __webpack_require__(1).processData;

	window.json2 = function(){
			processData(arguments[0]);
		};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var removeHTMLTag = __webpack_require__(2).removeHTMLTag;
	var setData = __webpack_require__(3).setData;
	var volMaga = __webpack_require__(5).volMaga();
	var category = __webpack_require__(6).category();
	var throttle = __webpack_require__(7).throttle;
	var pageLoadFunc = __webpack_require__(8).pageLoad;
	var jumpHref = __webpack_require__(4).jumpHref;
	var dataFilter = __webpack_require__(9).dataFilter;
	var gqs = __webpack_require__(10).GetQueryString;

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

/***/ },
/* 2 */
/***/ function(module, exports) {

	exports.removeHTMLTag = function(str) {
	    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
	    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
	    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
	    return str;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var removeHTMLTag = __webpack_require__(2).removeHTMLTag;
	var jumpHref = __webpack_require__(4).jumpHref;

	exports.setData = function(data){
		data.forEach(function(item, idx){
			for(var key in item){
				switch(key){
					case "_id": 
						data[idx].magaDetail = jumpHref('maga_detail.html?id=' + item[key]);
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
						data[idx].linkText = removeHTMLTag(temp);
						temp = data[idx].linkText;
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

/***/ },
/* 4 */
/***/ function(module, exports) {

	exports.jumpHref = function(jumpPath){ // 期刊链接处理
		var p = location.pathname, 
			pArr = p.split('/');
		pArr.pop();
		p = location.origin+pArr.join('/')+'/'+jumpPath;

		return p;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	exports.volMaga = function(){
		var volMaga = [
			{"vol": 1, "date": "2015-10-26", "prewords": "专治灵感枯竭、技术盲症候群", "cover": "images/cover/vol_1.jpg", "covers":"images/cover/vol_1_s.jpg", "hexocolor": ["ffcf28", "ff9d02"], "shareTitle": "开刊号请多指教［鞠躬］", "shareText": "专治灵感枯竭、技术盲症候群"}, 
			{"vol": 2, "date": "2015-11-9", "prewords": "近水楼台先得月", "cover": "images/cover/vol_2.jpg", "covers":"images/cover/vol_2_s.jpg", "hexocolor": ["C3BFD5", "495B81"], "shareTitle": "哗，6个案例个个精彩绝伦", "shareText": "还真的有周杰伦"}, 
			{"vol": 3, "date": "2015-11-23", "prewords": "双十一，真·热（sàng）火（xīn）朝（bìng）天（kuáng）", "cover": "images/cover/3.png", "covers":"images/cover/3_s.png", "hexocolor": ["FE4C4A", "AF004D"], "shareTitle": "双十一特刊：去京东找你妹亲一口［羞涩脸］", "shareText": "看完这些H5再买买买"}, 
			{"vol": 4, "date": "2015-12-28", "prewords": "新年新气象～（是不是有点早", "cover": "images/cover/4.jpg", "covers":"images/cover/4_s.jpg", "hexocolor": ["ffcf28", "ff9d02"], "shareTitle": "做梦都在打牌牌刷钱钱", "shareText": "新年新气象～（是不是有点早"}, 
			{"vol": 5, "date": "2016-01-25", "prewords": "备好一台电脑一二三五部手机", "cover": "images/cover/vol_5.jpg", "covers":"images/cover/vol_5_s.jpg", "hexocolor": ["f6a625", "d73930"], "shareTitle": "不建议一人观看——多屏互动特刊", "shareText": "备好一台电脑一二三五部手机"}, 
			{"vol": 6, "date": "2016-02-29", "prewords": "擦亮你的双眼", "cover": "images/cover/vol_6.jpg", "covers":"images/cover/vol_6_s.jpg", "hexocolor": ["f8cacb", "e04d36"], "shareTitle": "放大世界我看到了金钱和肉体", "shareText": "喂？幺幺零吗？"}, 
			{"vol": 7, "date": "2016-03-28", "prewords": "文青入门手册", "cover": "images/cover/vol_7.jpg", "covers":"images/cover/vol_7_s.jpg", "hexocolor": ["BECEBE", "072"], "shareTitle": "一大波文艺梗即将袭来", "shareText": "Look! A pair of boobs! -> (.Y.)"}, 
			{"vol": 8, "date": "2016-04-26", "prewords": "CSS3动画开发指南", "cover": "images/cover/vol_8.jpg", "covers":"images/cover/vol_8_s.jpg", "hexocolor": ["29a9df", "0170ba"], "shareTitle": "专治CSS3动画技术盲", "shareText": "小编不想推送案例并向你扔了一系列深度剖析文"}
		];

		return volMaga;
	}



/***/ },
/* 6 */
/***/ function(module, exports) {

	exports.category = function(){
		var category = [
			{name: '其他', cat: 'classify'}, 
			{name: '游戏', cat: 'classify'}, 
			{name: '短片', cat: 'classify'}, 
			{name: '翻页动画', cat: 'classify'}, 
			{name: '多屏互动', cat: 'classify'}, 
			{name: '活动运营', cat: 'classify'}, 
			{name: '产品介绍', cat: 'classify'}, 
			{name: '游戏互动', cat: 'classify'}, 
			{name: '品牌宣传', cat: 'classify'}, 
			{name: '总结报告', cat: 'classify'}, 
			{name: '邀请函', cat: 'classify'}, 
			{name: '创意指数5星', cat: 'grade_creativity'}, 
			{name: '实现难度5星', cat: 'grade_difficulty'}, 
			{name: '豆瓣', cat: 'keywords'}, 
			{name: 'W', cat: 'keywords'}, 
			{name: '腾讯', cat: 'keywords'}, 
			{name: '大众点评', cat: 'keywords'}, 
			{name: 'JDC', cat: 'keywords'}
		];

		return category;
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	exports.throttle = function (func, wait, mustRun, vue, events){
		var timeout, 
			startTime = new Date();


		return function() {
			var context = vue, 
				args = events, 
				curTime = new Date();

			clearTimeout(timeout);
			// 如果达到了规定的触发时间间隔，触发handler
			if(curTime - startTime >= mustRun){
				func.apply(context, events);
				startTime = curTime;
			//没达到触发间隔，重新设定定时器
			}else{
				timeout = setTimeout(func.bind(context, events), wait);
			}
		};
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	exports.pageLoad = function(e){
		var $knot = document.querySelector('.case_load'), 
			winHeight = window.screen.availHeight, 
			knotPos = $knot.offsetTop, 
			scrollPos = e.target.scrollTop;

			if(scrollPos + winHeight + 10 >= knotPos){
				this.pageLoad();
			}else{
				return;
			}
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	exports.dataFilter = function(data, keywords, category){
		var keys = (category == 'grade_creativity' || category == 'grade_difficulty') ? keywords[keywords.search(/\d/)].split('') : (typeof keywords == 'string') ? keywords.split(' ') : keywords, 
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

/***/ },
/* 10 */
/***/ function(module, exports) {

	exports.GetQueryString = function (name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}

/***/ }
/******/ ]);