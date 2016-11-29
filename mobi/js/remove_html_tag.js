exports.removeHTMLTag = function(str) {
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return str;
};