var jumpHref = require('./jumpHref').jumpHref;
var indexHref = require('./config').config().indexHref;
exports.coverClick = function (item,){ // 索引添加单击事件
	document.querySelector(item).addEventListener('click', function(){
		location.href = jumpHref(indexHref);
	});
}