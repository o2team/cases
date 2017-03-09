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
		var args = arguments[0];
			var si = setInterval(function(){
				if(volMaga){
					processData(args);
					clearInterval(si);
				}
			}, 200);
		};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var removeHTMLTag = __webpack_require__(2).removeHTMLTag;
	var setData = __webpack_require__(3).setData;
	var category = __webpack_require__(6).category();
	var throttle = __webpack_require__(7).throttle;
	var pageLoadFunc = __webpack_require__(8).pageLoad;
	var jumpHref = __webpack_require__(4).jumpHref;
	var dataFilter = __webpack_require__(9).dataFilter;
	var gqs = __webpack_require__(10).GetQueryString;
	var lazyLoad = __webpack_require__(11).lazyLoad;
	var wxShare = __webpack_require__(16).wxShare();

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
						if(item[key][0]){
							item[key].forEach(function(url, uidx){
								temp += url.url;
							});
							data[idx].linkText = removeHTMLTag(temp);
							temp = data[idx].linkText;
							data[idx].magaLinkShort = temp.split('').splice(0, 200).join('') + '...';
						} 
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
/* 5 */,
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

/***/ },
/* 10 */
/***/ function(module, exports) {

	exports.GetQueryString = function (name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  decodeURIComponent(r[2]); return null;
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	// author: EC
	// last modify: 2015-12-25 13:16

	exports.lazyLoad = function (context, container){
	    var doc = document,
	        body = doc.body,
	        win = window, 
	        $win = win.document.documentElement, 
	        $cont = container ? container : null, 
	        uid = 0,
	        elements = {}, 
	        imgArr = [];

	    function getUid(el){
	        return el.__uid || (el.__uid = ('' + (++uid)));
	    }

	    function getWindowOffset(){
	        var t,
	            pageXOffset = (typeof win.pageXOffset == 'number') ? win.pageXOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollLeft == 'number' ? t : body).ScrollLeft,
	            pageYOffset = (typeof win.pageYOffset == 'number') ? win.pageYOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollTop == 'number' ? t : body).ScrollTop;
	        return {
	            offsetX: pageXOffset,
	            offsetY: pageYOffset
	        };
	    }

	    function isVisible(iElement){
	        var elem = iElement,
	            elemRect = elem.getBoundingClientRect(),
	            windowOffset = getWindowOffset(),
	            winOffsetX = windowOffset.offsetX,
	            winOffsetY = windowOffset.offsetY,
	            elemWidth = elemRect.width,
	            elemHeight = elemRect.height,
	            elemOffsetX = elemRect.left + winOffsetX,
	            elemOffsetY = elemRect.top + winOffsetY,
	            viewWidth = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0),
	            viewHeight = Math.max(doc.documentElement.clientHeight, win.innerHeight || 0),
	            xVisible,
	            yVisible;

	        if(elemOffsetY <= winOffsetY){
	            if(elemOffsetY + elemHeight >= winOffsetY){
	                yVisible = true;
	            }
	        }else if(elemOffsetY >= winOffsetY){
	            if(elemOffsetY <= winOffsetY + viewHeight){
	                yVisible = true;            }
	        }

	        if(elemOffsetX <= winOffsetX){
	            if(elemOffsetX + elemWidth >= winOffsetX){
	                xVisible = true;
	            }
	        }else if(elemOffsetX >= winOffsetX){
	            if(elemOffsetX <= winOffsetX + viewWidth){
	                xVisible = true;
	            }
	        }

	        return xVisible && yVisible;
	    };

	    function checkImage(){
	        Object.keys(elements).forEach(function(key){
	            var obj = elements[key],
	                iElement = obj.iElement,
	                lazySrc = obj.lazySrc, 
	                eleSrc = iElement.getAttribute('src');

	            if(isVisible(iElement) && !eleSrc){
	                iElement.setAttribute('src', lazySrc);
	                iElement.style.opacity = 1;
	            }
	        });
	    }

	    if($cont){
	        var contLen = $cont.length;
	        if(contLen > 1){
	            for(var i=0; i<contLen; i++){
	                $cont[i].addEventListener('scroll', checkImage);
	            }
	        }else{
	            $cont.addEventListener('scroll', checkImage);
	        }
	    }else{
	        win.addEventListener('scroll', checkImage);
	    }
	    $win.addEventListener('resize', checkImage);
	    'ontouchstart' in window && $win.addEventListener('touchmove', checkImage);

	    function onLoad(e){
	        var $el = this,
	            uid = getUid($el);

	        // $el.css('opacity', 1);
	        this.style.opacity = '1';

	        if(elements.hasOwnProperty(uid)){
	            delete elements[uid];
	        }
	    }

	    if(context){
	        imgArr = context.getElementsByTagName('img');
	    }else{
	        imgArr = doc.getElementsByTagName('img');
	    }

	    for(var i=0; i<imgArr.length; i++){
	        var el = imgArr[i], 
	            src = imgArr[i].getAttribute('lazy-src');

	        el.addEventListener('load', onLoad);

	        if(src){
	            if(isVisible(el)){
	                el.setAttribute('src', src);
	                el.style.opacity = 1;
	            }else{
	                var uid = getUid(el);
	                el.style.backgroundColor = '#fff';
	                el.style.opacity = 1; 
	                el.style.webkitTransition = 'opacity .2s'; 
	                el.style.transition = 'opacity .2s';

	                elements[uid] = {
	                    iElement: el, 
	                    lazySrc: src
	                };
	            }
	        }

	        el.removeEventListener('load', onLoad);
	    }

	    setTimeout(function(){checkImage();}, 200);
	};

/***/ },
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports) {

		/**
		* 微信分享
		*/

	exports.wxShare = function (){	
		var wxShare = function(img_url,img_width,img_height,link,title,desc,callback,appid){

	    	document.addEventListener('WeixinJSBridgeReady', onBridgeReady);
	    	if(typeof WeixinJSBridge != 'undefined'){
	    		onBridgeReady();
	    	}

		    function onBridgeReady() {
		        WeixinJSBridge.on('menu:share:timeline', function(argv){
		            WeixinJSBridge.invoke('shareTimeline',{
		                "img_url":img_url,
		                "img_width":img_width,
		                "img_height":img_height,
		                "link":link,
		                "title": title,
		                "desc":desc
		            }, function() {
		                callback('timeline');
		            });
		        });

		        WeixinJSBridge.on('menu:share:appmessage', function(argv){

		            WeixinJSBridge.invoke('sendAppMessage',{
		                "appid":appid || "",
		                "img_url":img_url,
		                "img_width":img_width,
		                "img_height":img_height,
		                "link":link,
		                "title": title,
		                "desc":desc
		            }, function() {
		                callback('appmessage');
		            })

		        });


		        WeixinJSBridge.on('menu:share:weibo', function(argv){
		          WeixinJSBridge.invoke('shareWeibo',{
		             "content":title,
		             "url":link
		          }, function(res){
		            callback('weibo');
		          });
		        });

		        WeixinJSBridge.on('menu:share:facebook', function(argv){
		          (dataForWeixin.callback)();
		          WeixinJSBridge.invoke('shareFB',{
		                "img_url":img_url,
		                "img_width":img_width,
		                "img_height":img_height,
		                "link":link,
		                "title": title,
		                "desc":desc
		          }, function(res){
		            callback('facebook');
		          });
		        });

		    }
		}

		return wxShare;
	}
		

/***/ }
/******/ ]);