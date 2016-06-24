exports.throttle = function (func, wait, mustRun, vue, events){
	var timeout, 
		startTime = new Date();


	return function() {
		var context = vue, 
			args = events, 
			curTime = new Date();

		clearTimeout(timeout);
		// 如果达到了规定的触发时间间隔，触发handler
		if(curTime - startTime >= mustRun){
			func.apply(context, events);
			startTime = curTime;
		//没达到触发间隔，重新设定定时器
		}else{
			timeout = setTimeout(func.bind(context, events), wait);
		}
	};
};