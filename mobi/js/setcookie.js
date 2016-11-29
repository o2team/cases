// author: EC
// last modify: 2015-12-25 13:16

function getCookie(name){
	var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg)){
		return unescape(arr[2]);
	}
	else{
		return null;
	}
}

function setCookie(name, val){
	document.cookie = name + '=' + escape(val);
}

function delCookie(name){
	var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}