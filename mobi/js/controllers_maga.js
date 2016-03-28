// author: EC
// last modify: 2016-2-11 12:48

var volMaga = require('./vol_maga').volMaga();
var vol = require('./getVol').vol();	//获取当前期数
var lazyLoad = require('./lazyload2.0.js').lazyLoad;	//图片预加载
var Slides = require('./slides').Slides();	//页面滑动
var setShare = require('./setShare').setShare;	//设置分享参数
var jumpHref = require('./jumpHref').jumpHref;	// 索引添加单击事件
var coverClick = require('./coverClick').coverClick;	// 索引添加单击事件

var cases = angular.module('cases', ['ngRoute']), 
	data = [], 
	// qrIdPre = 'caseqc_', 
	h5type = [{"name": "其他", "id": 0}, 
		{"name": "游戏", "id": 1}, 
		{"name": "短片", "id": 2}, 
		{"name": "翻页动画", "id": 3}, 
		{"name": "多屏互动", "id": 4}], 			//案例类型表
	indexHref = 'maga.html', 					//索引地址
	$cover = document.querySelector('.cover'), 	//期刊封面钩子
	coverLoaded = 'page cover loaded', 			//加载完毕期刊封面类名
	sec = '.ar_sec', 							//每屏内容类
	indexLi = '.li_cover', 						//索引项类
	$indexCover = document.querySelector('.fcover'), //索引封面
	indexCoverLoaded = 'page fcover loaded', 	//加载完毕索引封面类名
	$magaBox = document.getElementById('magazines'), //期刊容器
	$indexBox = document.getElementById('index'), //索引容器
	likeClass = '.ar_love', 					//点赞类名
	indexJumpClass = ['.ar_list', '.bc_back'], 	//索引页入口按钮类名
	aotuBlue = ['A2C0F9', '6190e8']; 			//凹凸蓝


// 索引设置
function indexSet($scope){
	$magaBox.style.display = 'none';
	$indexBox.style.display = 'block';
	$indexBox.style.transform = 'translateY(0)';
	$indexBox.style.webkitTransform = 'translateY(0)';
	var show = setInterval(function(){
		var bb = document.querySelectorAll(indexLi).length;

		if(bb===$scope.volList.length){
			clearInterval(show);
			$indexCover.setAttribute('class', indexCoverLoaded);
			setTimeout(function(){$indexCover.style.display="none";}, 1000);

			lazyLoad(document.getElementById('index'));
		}
	});
}

// 期刊设置
function magaSet(){
	$magaBox.style.display = 'block';
	$indexBox.style.display = 'none';
	$magaBox.style.transform = 'translateY(0)';
	$magaBox.style.webkitTransform = 'translateY(0)';
}

// 期刊加载完毕
function magaLoaded() {
	$cover.setAttribute('class', coverLoaded);
	setTimeout(function(){$cover.style.display="none";}, 1000);
}

// 控制器
cases.controller('casesList', function($scope, $http, $sce) {
	$scope.vol = GetQueryString('vol'); //期数
	
	//设置期数cookie
	var s, preepi = (s = getCookie('epi')) ? s: '';
	setCookie('preepi', preepi);
	setCookie('epi', $scope.vol);

	//字符串转html代码
	var parseHtml = function(item) {
		return $sce.trustAsHtml(item);
	};

	// 点赞初始化
	var likeInit = function(total) {
		for(var i=0; i<total; i++){
			var likeEle = document.querySelectorAll(likeClass)[i];

			likeEle.addEventListener('click', function(e){
				var self = this, 
					key = self.getAttribute('data-key'), 
					likeIndex = self.getAttribute('data-index');
				likePull(key, likeIndex, self);
			});
		}
	}

	// 点赞数据拉取
	var likePull = function (key, likeIndex, self){
		$http.post('http://aotu.jd.com/common/api/up',{key: key})
			.then(function(res){
				var msg = res.data.msg, 
					s, 
					count = (s = $cl[likeIndex].like) ? s : 0;
				if(msg === "点赞成功"){
					$cl[likeIndex].likeClass = ' loved';
					// self.setAttribute('class', 'ar_love loved');
					localStorage.setItem(key, 1);
					count ++;
				}else if(msg === "取消点赞成功"){
					$cl[likeIndex].likeClass = '';
					// self.setAttribute('class', 'ar_love');
					localStorage.removeItem(key);
					count --;
					if(count<0){
						count = 0;
					}
				}
				$cl[likeIndex].like = count ? count : '';
			});
	}

	//跳转索引
	indexJumpClass.map(coverClick);

	window.json1 = function(){
		var volList = volMaga, 
			latest = volList[volList.length-1].vol, 
			before = volList[0].vol - 1,
			pt, projectTime, 
			random = Math.random();
			// random = 0.03;

		$scope.volList = volList.reverse();

		if($scope.vol){
			var latestVol = parseInt(latest.vol), 
				curVol, 
				coverSet = function (item){
					if(item.vol === curVol){
						$scope.date = item.date;
						$scope.cover = item.cover;
						$scope.covers = item.covers;
						$scope.hexocolor = random < 0.1 ? aotuBlue : item.hexocolor;

						if(!!item.prewords && item.prewords!==""){
							var prewordsCont = item.prewords.split('\n');
							$scope.prewords = prewordsCont.map(parseHtml);
						}
					}
				};

			magaSet();

			//最新期
			if($scope.vol === 'latest'){
				$scope.vol = latest;
			}

			curVol = parseInt($scope.vol);

			volList.forEach(coverSet);

			if($scope.date){
				pt = $scope.date.split('-');
				projectTime = new Date(parseInt(pt[0]), parseInt(pt[1])-1, parseInt(pt[2])).toISOString();
				$http.jsonp('http://jdc.jd.com/jdccase/jsonp/project?category=app&projectTime='+projectTime+'&callback=json2');
			}else if(!$scope.date && $scope.vol>latestVol){
				location.href = jumpHref(indexHref);
			}
		}else{
			indexSet($scope);
		}
	}
	json1();

	window.json2 = function (data) { 
		var likeObj = [], 
			likeArr = [];
		data = data;
		$cl = $scope.caselist = data.sort(function(a, b){
			if(a._id < b._id){
				return -1;
			}else {
				return 0;
			}
		});

		$cl.forEach(function(item, idx){
			var key = item._id;
			item.index = idx;
			item.vd = item.vd.split(',');
			item.fe=item.fe.split(',');
			item.title=parseHtml(item.title);

			item.fe.forEach(function(feItem, idx2, arr){
				var rate = "", star = "★", 
					starNum = parseInt(feItem);

				for(var k=0; k<starNum; k++){
					rate += star;
				}
				item.fe[idx2] = rate;
			});

			var descCont=item.desc.split('\n');
			h5type.forEach(function(type){
				if(item.type[1].name===type.name){
					item.type[1].id = type.id;
				}
			});

			item.desc = descCont.map(parseHtml);
			var linksCont = item.links.map(function(para){return para.url;});
			item.links = linksCont.map(parseHtml);

			$http.get('http://aotu.jd.com/common/api/up/count?key='+key)
				.success((function (key) {
					return function(res){
						var count = res.count ? res.count : '', 
							setlike = function (item){
								if(key === item._id){
									item.like = count;
									if(localStorage.getItem(key)){
										item.likeClass = ' loved';
									}
								}
							};
						$cl.forEach(setlike);
					};
			})(key));
		});

		setTimeout(function(){
			var show = setInterval(function(){
				var bb = document.querySelectorAll(sec).length;
				
				if(bb===($cl.length+1)){
					clearInterval(show);
					magaLoaded();

					likeInit((bb-1)*2);

					Mode.init();
					Slides.secNum = bb;
					Slides.init();
				}
		});}, 1000);
	}

	setShare();
});