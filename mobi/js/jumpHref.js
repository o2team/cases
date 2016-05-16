exports.jumpHref = function(jumpPath){ // 期刊链接处理
	var p = location.pathname, 
		pArr = p.split('/');
	pArr.pop();
	p = location.origin+pArr.join('/')+'/'+jumpPath;

	return p;
}