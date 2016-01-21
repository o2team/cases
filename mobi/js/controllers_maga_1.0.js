// author: EC
// last modify: 2015-12-25 13:16

var cases = angular.module('cases', ['ngRoute']), 
	data = [], 
	// qrIdPre = 'caseqc_', 
	h5type = [{"name": "其他", "id": 0}, 
		{"name": "游戏", "id": 1}, 
		{"name": "短片", "id": 2}, 
		{"name": "翻页动画", "id": 3}, 
		{"name": "多屏互动", "id": 4}], //案例类型表
	indexHref = 'maga.html', //索引地址
	beforeHref = 'mail.html?vol=', //3期及以前地址
	$cover = document.querySelector('.cover'), //期刊封面钩子
	coverLoaded = 'page cover loaded', //加载完毕期刊封面类名
	sec = '.ar_sec', //每屏内容类
	indexLi = '.li_cover', //索引项类
	$indexCover = document.querySelector('.fcover'), //索引封面
	indexCoverLoaded = 'page fcover loaded', //加载完毕索引封面类名
	$magaBox = document.getElementById('magazines'), //期刊容器
	$indexBox = document.getElementById('index'), //索引容器
	likeClass = '.ar_love', //点赞类名
	aotuBlue = ['A2C0F9', '6190e8']; //凹凸蓝

cases.controller('casesList', function($scope, $http, $sce){
	$scope.vol = GetQueryString('vol'); //期数
	
	//设置期数cookie
	var s, preepi = (s = getCookie('epi')) ? s: '';
	setCookie('preepi', preepi);
	setCookie('epi', $scope.vol);

	//字符串转html代码
	parseHtml = function(array){
		for(var p=0; p<array.length; p++){
			array[p] = $sce.trustAsHtml(array[p]);
		}
	}

	//跳转索引
	document.querySelector('.ar_list').addEventListener('click', function(){
		location.href = jumpHref(indexHref);
	});
	document.querySelector('.bc_back').addEventListener('click', function(){
		location.href = jumpHref(indexHref);
	});

	//获取索引信息
	// $http.get('js/vol_maga.js')
	// 	.success(function(res){
	// 		json1(res);
	// 	});

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
				curVol;

			magaSet();

			//最新期
			if($scope.vol === 'latest'){
				$scope.vol = latest;
			}

			if($scope.vol <= before){
				location.href = jumpHref(beforeHref+$scope.vol);
			}

			for(var v=0; v<volList.length; v++){
				if(volList[v].vol === parseInt($scope.vol)){
					$scope.date = volList[v].date;
					$scope.cover = volList[v].cover;
					if(random<0.1){
						$scope.hexocolor = aotuBlue;
					}else{
						$scope.hexocolor = volList[v].hexocolor;

					}
					if(!!volList[v].prewords && volList[v].prewords!==""){
						$scope.prewords = volList[v].prewords.split('\n');
					}
				}
			}
			curVol = parseInt($scope.vol);
			$scope.prevol = (curVol - 1)<=0?0:(curVol - 1);
			$scope.nextvol = (curVol + 1)>latestVol?0:curVol + 1;
	
			if($scope.prewords){
				parseHtml($scope.prewords);
			}

			if($scope.date){
				pt = $scope.date.split('-');
				projectTime = new Date(parseInt(pt[0]), parseInt(pt[1])-1, parseInt(pt[2])).toISOString();
				$http.jsonp('http://jdc.jd.com/jdccase/jsonp/project?category=app&projectTime='+projectTime+'&callback=json2');
			}else if(!$scope.date && $scope.vol>latestVol){
				location.href = jumpHref(indexHref);
			}
		}else{
			// 获取旧版内容
			$http.get('js/vol.js')
				.success(function(res){
					json3(res);
				});
			indexSet();
		}
	}
	json1();

	window.json2 = function (data) { 
		var likeObj = [], 
			likeArr = [];
		data = data;
		$scope.caselist = data.reverse();
		var itemNum = $scope.caselist.length;

		for(var i=0; i<itemNum; i++){
			var key = $scope.caselist[i]._id;
			$scope.caselist[i].index=i;
			$scope.caselist[i].vd=$scope.caselist[i].vd.split(',');
			$scope.caselist[i].fe=$scope.caselist[i].fe.split(',');
			$scope.caselist[i].title=$sce.trustAsHtml($scope.caselist[i].title);

			for(var j=0; j<$scope.caselist[i].fe.length; j++){
				var rate = "", star = "★";
				for(var k=0; k<parseInt($scope.caselist[i].fe[j]); k++){
					rate+=star;
				}
				$scope.caselist[i].fe[j]=rate;
			}
			$scope.caselist[i].desc=$scope.caselist[i].desc.split('\n');
			for(var t=0; t<h5type.length; t++){
				if($scope.caselist[i].type[1].name===h5type[t].name){
					$scope.caselist[i].type[1].id = h5type[t].id;
				}
			}
			/*$scope.caselist[i].desc.forEach(parseHtml);
			$scope.caselist[i].links.forEach(parseHtml);*/
			parseHtml($scope.caselist[i].desc);
			for(var u=0; u<$scope.caselist[i].links.length; u++){
				$scope.caselist[i].links[u].url = $sce.trustAsHtml($scope.caselist[i].links[u].url);
			}

			$http.get('http://aotu.jd.com/common/api/up/count?key='+key)
				.success((function (key) {
					return function(res){
						var count = res.count ? res.count : '', 
							likeNum, liked;
						for(var i=0; i<itemNum; i++){
							var item = $scope.caselist[i];
							if(key === item._id){
								item.like = count;
								if(localStorage.getItem(key)){
									item.likeClass = ' loved';
								}
							}
						}
					};
			})(key));
		}

		setTimeout(function(){
			var show = setInterval(function(){
				var bb = document.querySelectorAll(sec).length;
				
				if(bb===($scope.caselist.length+1)){
					clearInterval(show);
					$cover.setAttribute('class', coverLoaded);
					setTimeout(function(){$cover.style.display="none";}, 1000);

					for(var i=0; i<bb-1; i++){
						var likeEle = document.querySelectorAll(likeClass)[i];

						likeEle.addEventListener('click', function(e){
							var self = this, 
								key = self.getAttribute('data-key'), 
								likeIndex = self.getAttribute('data-index');
							
							$http.post('http://aotu.jd.com/common/api/up',{key: key})
								.then(function(res){
									var msg = res.data.msg, 
										s, 
										count = (s = $scope.caselist[likeIndex].like) ? s : 0;
									if(msg === "点赞成功"){
										self.setAttribute('class', 'ar_love loved');
										localStorage.setItem(key, 1);
										count ++;
									}else if(msg === "取消点赞成功"){
										self.setAttribute('class', 'ar_love');
										localStorage.removeItem(key);
										count --;
										if(count<0){
											count = 0;
										}
									}
									$scope.caselist[likeIndex].like = count;
								});
						});
					}

					Mode.init();
					Slides.secNum = bb;
					Slides.init();
				}
		});}, 1000);
	}

	window.json3 = function(res){
		var volList2 = res.reverse();
		$scope.volList.push.apply($scope.volList, volList2);

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
});

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

function jumpHref(jumpPath){
	var p = location.pathname, 
		pArr = p.split('/');
	pArr.pop();
	p = location.origin+pArr.join('/')+'/'+jumpPath;

	return p;
}

//索引设置
function indexSet(){
	$magaBox.style.display = 'none';
	$indexBox.style.display = 'block';
	$indexBox.style.transform = 'translateY(0)';
	$indexBox.style.webkitTransform = 'translateY(0)';
}

//期刊设置
function magaSet(){
	$magaBox.style.display = 'block';
	$indexBox.style.display = 'none';
	$magaBox.style.transform = 'translateY(0)';
	$magaBox.style.webkitTransform = 'translateY(0)';
}