// author: EC
// last modify: 2015-12-19 17:57

var cases = angular.module('cases', ['ngRoute']), 
	data = [], 
	qrIdPre = 'caseqc_', 
	h5type = [{"name": "其他", "id": 0}, 
		{"name": "游戏", "id": 1}, 
		{"name": "短片", "id": 2}, 
		{"name": "翻页动画", "id": 3}, 
		{"name": "多屏互动", "id": 4}], 
	indexHref = 'maga.html', 
	beforeHref = 'mail.html?vol=', 
	cover = document.querySelector('.cover'), 
	coverLoaded = 'page cover loaded', 
	sec = document.querySelectorAll('.ar_sec'), 
	indexLi = '.li_cover', 
	indexCover = document.querySelector('.fcover'), 
	indexCoverLoaded = 'page fcover loaded', 
	magaBox = document.getElementById('magazines'), 
	indexBox = document.getElementById('index');

cases.controller('casesList', function($scope, $http, $sce){
	$scope.vol = GetQueryString('vol');
	$scope.prevol = $scope.nextvol = 0;

	parseHtml = function(array){
		for(var p=0; p<array.length; p++){
			array[p] = $sce.trustAsHtml(array[p]);
		}
	}

	document.querySelector('.ar_list').addEventListener('click', function(){
		location.href = jumpHref(indexHref);
	});

	document.querySelector('.bc_back').addEventListener('click', function(){
		location.href = jumpHref(indexHref);
	});

	window.json2 = function(res){
		var volList = res, 
			latest = volList[volList.length-1].vol + 3, 
			before = volList[0].vol - 1,
			pt, projectTime;
		$scope.volList = volList.reverse();

		$http.get('js/vol.js')
			.success(function(res){
				json3(res);
			});


		if($scope.vol){
			var latestVol = parseInt(latest.vol), 
				curVol;

			magaSet();

			if($scope.vol === 'latest'){
				$scope.vol = latestVol;
			}

			if($scope.vol <= before){
				location.href = jumpHref(beforeHref+$scope.vol);
			}

			for(var v=0; v<volList.length; v++){				if(volList[v].vol === parseInt($scope.vol)){
					$scope.date = volList[v].date;
					$scope.cover = volList[v].cover;
					$scope.hexocolor = volList[v].hexocolor;
					if(!!volList[v].prewords && volList[v].prewords!==""){
						$scope.prewords = volList[v].prewords.split('\n');
					}
				}
			}
			curVol = parseInt($scope.vol);
			$scope.prevol = (curVol - 1)<=0?0:(curVol - 1);
			$scope.nextvol = (curVol + 1)>latestVol?0:curVol + 1;
		}else{
			indexSet();
		}
	
		if($scope.prewords){
			parseHtml($scope.prewords);
		}

		if($scope.date){
			pt = $scope.date.split('-');
			projectTime = new Date(parseInt(pt[0]), parseInt(pt[1])-1, parseInt(pt[2])).toISOString();
			$http.jsonp('http://jdc.jd.com/jdccase/jsonp/project?category=app&projectTime='+projectTime+'&callback=json1');
		}else if(!$scope.date && $scope.vol>latestVol){
			location.href = jumpHref(indexHref);
		}
	}

	$http.get('js/vol_maga.js')
		.success(function(res){
			json2(res);
		});
		
	window.json1 = function (data) { 
		data = data;
		$scope.caselist = data.reverse();

		for(var i=0; i<$scope.caselist.length; i++){
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
		}

		setTimeout(function(){
			var show = setInterval(function(){
				var bb = sec.length;
				
				if(bb===($scope.caselist.length+1)){
					clearInterval(show);
					// for(var q=0; q<$scope.caselist.length; q++){
					// 	var qrcode = new QRCode(document.getElementById(qrIdPre+$scope.caselist[q]._id), $scope.caselist[q].url);
					// }
					cover.setAttribute('class', coverLoaded);
					setTimeout(function(){cover.style.display="none";}, 1000);

					lazyLoad();
					Mode.init();
					Slides.secNum = bb;
					Slides.init();
				}
		});}, 1000);
	}

	window.json3 = function(res){
		var volList2 = res.reverse();
		$scope.volList.push.apply($scope.volList, volList2);

		setTimeout(function(){
			var show = setInterval(function(){
				var bb = document.querySelectorAll(indexLi).length;

				if(bb===$scope.volList.length){
					clearInterval(show);
					indexCover.setAttribute('class', indexCoverLoaded);
					setTimeout(function(){indexCover.style.display="none";}, 1000);

					lazyLoad();
				}
		});}, 1000);
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

function indexSet(){
	magaBox.style.display = 'none';
	indexBox.style.display = 'block';
	indexBox.style.transform = 'translateY(0)';
	indexBox.style.webkitTransform = 'translateY(0)';
}

function magaSet(){
	magaBox.style.display = 'block';
	indexBox.style.display = 'none';
	magaBox.style.transform = 'translateY(0)';
	magaBox.style.webkitTransform = 'translateY(0)';
}