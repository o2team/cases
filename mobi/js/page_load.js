exports.pageLoad = function(e){
	var $knot = document.querySelector('.case_load'), 
		winHeight = window.screen.availHeight, 
		knotPos = $knot.offsetTop, 
		scrollPos = e.target.scrollTop;

		if(scrollPos + winHeight + 10 >= knotPos){
			this.pageLoad();
		}else{
			return;
		}
};