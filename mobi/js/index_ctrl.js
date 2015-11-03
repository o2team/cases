//index_ctrl.js

var index = angular.module('index', ['ngRoute']),
	h5type = [{"name": "游戏", "id": 1}, 
		{"name": "短片", "id": 2}, 
		{"name": "翻页动画", "id": 3}, 
		{"name": "多屏互动", "id": 4}];

index.controller('iList', function($scope, $http, $sce){
	$scope.total = 0;
	parseHtml = function(array){
		for(var p=0; p<array.length; p++){
			array[p] = $sce.trustAsHtml(array[p]);
		}
	}

	$http.jsonp('http://jdc.jd.com/jdccase/jsonp/project?category=app&callback=json1');

	window.json1 = function (data) {
		var tmplist = data.reverse();
		$scope.ilist = [];

		for(var i=0; i<tmplist.length; i++){
			var tmpObj = {};
			tmpObj.title=tmplist[i].title;
			tmpObj.date=tmplist[i].projectTime;
			$scope.ilist.push(tmpObj);
		}

		$http.get('js/vol.js')
			.success(function(res){
				json2(res);
			});
	}

	window.json2 = function(res){
		$scope.volList = res.reverse();
		$scope.total = $scope.volList.length;

		var latest = $scope.volList[$scope.total-1], 
			pt, projectTime;

		if($scope.total>0){
			for(var v=0; v<$scope.total; v++){
				$scope.volList[v].date = $scope.volList[v].date.split('-').join('.');
				$scope.volList[v].titles = [];

				pt = $scope.date.split('.');
				projectTime = new Date(parseInt(pt[0]), parseInt(pt[1])-1, parseInt(pt[2]), 8, 0).toGMTString();

				for(var i=0; i<$scope.ilist.length; i++){
					if($scope.ilist[i].date === projectTime){

					}
				}
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