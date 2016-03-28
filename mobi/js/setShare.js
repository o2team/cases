var wxShare = require('./share').wxShare();
var GetQueryString = require('./GetQueryString').GetQueryString;

exports.setShare = function(){
	var vol = GetQueryString('vol')?GetQueryString('vol'):0, 
		shareTitle = "H5精品案例赏析", 
		shareText = "凹凸实验室品鉴小分队奉上", 
		volMaga = require('./vol_maga').volMaga();
		
	volMaga.forEach(function(item, idx){
		if(item.vol === parseInt(vol)){
			if(item.shareTitle){
				shareTitle = item.shareTitle;
			}
			if(item.shareText){
				shareText = item.shareText;
			}
		}
	});

	/*分享*/
	wxShare('http://jdc.jd.com/h5/case/img/share_3.0.png',100,100,location.href,shareTitle,shareText);
}