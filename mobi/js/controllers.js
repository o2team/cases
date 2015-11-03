//controllers.js

var cases = angular.module('cases', ['me-lazyload', 'ngRoute']), 
	data = [], 
	h5type = [{"name": "游戏", "id": 1}, 
		{"name": "短片", "id": 2}, 
		{"name": "翻页动画", "id": 3}, 
		{"name": "多屏互动", "id": 4}];

cases.controller('casesList', function($scope, $http, $sce){
	$scope.vol = GetQueryString('vol');
	$scope.preword = '';

	parseHtml = function(array){
		for(var p=0; p<array.length; p++){
			array[p] = $sce.trustAsHtml(array[p]);
		}
	}

	window.json2 = function(res){
		var volList = res, 
			latest = volList[volList.length-1], 
			pt, projectTime;
			if($scope.vol){
				for(var v=0; v<volList.length; v++){
					if(volList[v].vol === parseInt($scope.vol)){
						$scope.date = volList[v].date;
						if(!!volList[v].prewords){
							$scope.prewords = volList[v].prewords.split('\n');
						}
					}
				}
			}else{
				$scope.date = latest.date;
				$scope.vol = latest.vol;
				$scope.prewords = latest.prewords.split('\n');
			}
			
		parseHtml($scope.prewords);

		pt = $scope.date.split('-');
		projectTime = new Date(parseInt(pt[0]), parseInt(pt[1])-1, parseInt(pt[2])).toISOString();
		console.log(projectTime);
		$http.jsonp('http://jdc.jd.com/jdccase/jsonp/project?category=app&projectTime='+projectTime+'&callback=json1');
	}

	$http.get('js/vol.js')
		.success(function(res){
			json2(res);
		});
		
	window.json1 = function (data) { 
		data = data;
		$scope.caselist = data.reverse();

		for(var i=0; i<$scope.caselist.length; i++){
			$scope.caselist[i].vd=$scope.caselist[i].vd.split(',');
			$scope.caselist[i].fe=$scope.caselist[i].fe.split(',');
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

		document.querySelector('.loading').setAttribute('class', 'loading loaded');
		setTimeout(function(){document.querySelector('.loading').style.display="none";}, 400);
	}
});

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}