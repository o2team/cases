//controllers.js

var cases = angular.module('cases', ['me-lazyload', 'ngRoute']), 
	data = [];

cases.controller('casesList', function($scope, $http, $location, $sce){
	$scope.vol = $location.search().vol;
	$scope.date = '2015-10-26';
	$scope.preword = '';

	parseHtml = function(array){
		for(var p=0; p<array.length; p++){
			array[p] = $sce.trustAsHtml(array[p]);
		}
	}

	window.json2 = function(res){
		var volList = res, 
			pt, projectTime;
			for(var v=0; v<volList.length; v++){
				if(volList[v].vol === parseInt($scope.vol)){
					$scope.date = volList[v].date;
					if(!!volList[v].prewords){
						$scope.prewords = volList[v].prewords.split('\n');
						parseHtml($scope.prewords);
					}
				}
			}

		pt = $scope.date.split('-');
		projectTime = new Date(parseInt(pt[0]), parseInt(pt[1])-1, parseInt(pt[2]), 8, 0).toGMTString();
		$http.jsonp('http://jdc.jd.com/jdccase/jsonp/project?category=app&projectTime='+projectTime+'&callback=json1');
	}

	$http.get('js/vol.js')
		.success(function(res){
			json2(res);
		});
		
	window.json1 = function (data) { 
		data = data;
		$scope.caselist = data;

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
			/*$scope.caselist[i].desc.forEach(parseHtml);
			$scope.caselist[i].links.forEach(parseHtml);*/
			parseHtml($scope.caselist[i].desc);
			for(var u=0; u<$scope.caselist[i].links.length; u++){
				$scope.caselist[i].links[u].url = $sce.trustAsHtml($scope.caselist[i].links[u].url);
			}
		}
	}
});