// author: EC
// last modify: 2015-12-25 16:50
var lazyLoad = require('./lazyload2.0.js').lazyLoad;
exports.Slides = function(){
	var Slides = {
		// index: document.querySelector('.ar_nav'), 
		bar: document.querySelector('.ar_tool'), 
		secNum: 1, 
		cur: 0, 
		slideWrap: document.querySelector('.ar_wrap'), 
		slideBox: document.querySelector('.article'), 
		moreBtnClass: '.ar_cnt', 
		closeBtnClass: '.ar_full_close',
		detailClass: '.ar_full', 
		secClass: '.ar_sec', 
		frontshade: '.frontshade', 	// 防点透遮罩层

		winWidth: document.documentElement.clientWidth, 
		winHeight: document.documentElement.clientHeight, 
		startPos: 0, 
		move: 1, 
		move2: 1, 

		init: function(){
			var self = this;

			self.setSize();

			document.body.addEventListener('touchmove', self.noMove, false);
			window.onresize = function(){
				self.winWidth = document.documentElement.clientWidth;
				self.winHeight = document.documentElement.clientHeight;

				self.slideBox.style.width =	self.slideWrap.style.width = self.winWidth + 'px';
				self.slideBox.style.height = self.winHeight + 'px';
				self.slideWrap.style.height = self.winHeight * self.secNum + 'px';

				for(var i=0; i<self.secNum; i++){
					var secItem = document.querySelectorAll(self.secClass)[i];
					secItem.style.width = self.winWidth + 'px';
					secItem.style.height = self.winHeight + 'px';
				}
			};

			self.slideWrap.addEventListener('touchstart', function(e){
				self.startPos = e.changedTouches[0].clientY;

				self.slideWrap.addEventListener('touchmove', self.watch);
			});

			for(var i=0; i<self.secNum - 1; i++){
				document.querySelectorAll(self.moreBtnClass)[i].addEventListener('touchend', function(e){
					self.move = 0;

					var endPos = e.changedTouches[0].clientY, 
						posGap = endPos - self.startPos;

					if(posGap === 0){
						var id = this.getAttribute('data-id');
						self.move2 = 0;
						self.floatToggle(id, 'open');
						setCookie('detail', 1);
						document.querySelector(self.frontshade).style.display = 'block';
						setTimeout(function(){document.querySelector(self.frontshade).style.display = 'none'}, 1000);
					}
				});
				document.querySelectorAll(self.closeBtnClass)[i].addEventListener('touchend', function(){
					self.move = 1;
					self.move2 = 1;
					
					var id = this.getAttribute('data-id');
					self.floatToggle(id, 'close');
					delCookie('detail');
					delCookie('scroll');
				});
				document.querySelectorAll(self.detailClass)[i].addEventListener('scroll', function(){
					var scroll = this.scrollTop;
					setCookie('scroll', scroll);
				});
			}
		}, 

		setSize: function(){
			var self = this;
				// indexString = '';

			if(getCookie('epi') === getCookie('preepi')){
					var iniPage = getCookie('page'), 
					iniDetail = getCookie('detail'), 
					iniScroll = getCookie('scroll');
			}else{
				delCookie('page');
				delCookie('detail');
				delCookie('scroll');
			}

			self.slideBox.style.width =	self.slideWrap.style.width = self.winWidth + 'px';
			self.slideBox.style.height = self.winHeight + 'px';
			self.slideWrap.style.height = self.winHeight * self.secNum + 'px';

			for(var i=0; i<self.secNum; i++){
				var secItem = document.querySelectorAll(self.secClass)[i];
				secItem.style.width = self.winWidth + 'px';
				secItem.style.height = self.winHeight + 'px';
			}

			// for(var i=0; i<self.secNum; i++){
			// 	indexString += '<li></li>';
			// }

			// self.index.innerHTML = indexString;
			// self.index.childNodes[self.cur].setAttribute('class', 'cur');

			if(iniPage && iniPage !== '0'){
				self.cur = iniPage - 1;
				self.pageSet(self.cur);
				self.slideWrap.setAttribute('class', 'ar_wrap no_transition');
				// for(var i=0; i<self.secNum; i++){
				// 	lazyLoad(document.querySelectorAll('.ar_sec_wrap')[i]);
				// }
				setTimeout(function(){
					self.slideWrap.setAttribute('class', 'ar_wrap');
				}, 100);
			}else{
				self.pageSet(self.cur);
				// for(var i=0; i<self.secNum; i++){
				// 	lazyLoad(document.querySelectorAll('.ar_sec_wrap')[i]);
				// }
			}

			if(iniDetail && iniDetail !== '0'){
				var detailId = document.querySelectorAll(self.moreBtnClass)[self.cur].getAttribute('data-id');

				self.move = 0;
				self.move2 = 0;
				self.floatToggle(detailId, 'open');
			}

			if(iniScroll){
				var curDetail = document.querySelectorAll(self.detailClass)[self.cur];
				curDetail.scrollTop = iniScroll;
				lazyLoad(curDetail, document.querySelectorAll(self.detailClass));
			}
		}, 

		noMove: function(e){
			if(Slides.move){
				e.preventDefault();
			}
		}, 

		watch: function(e){
			if(Slides.move2){
				e.preventDefault();
				Slides.endPos = e.changedTouches[0].clientY;
				var posGap = Slides.endPos - Slides.startPos;
				
				if(Math.abs(posGap) > 50){
					Slides.pageMov(posGap);
					Slides.slideWrap.removeEventListener('touchmove', Slides.watch);
				}
			}
		}, 

		pageMov: function(distance){
			var self = this;

			if(distance>0){
				self.cur -= 1;
				if(self.cur < 0){
					self.cur = 0;
				}
			}else if(distance<0){
				self.cur += 1;
				if(self.cur > (self.secNum-1)){
					self.cur = self.secNum - 1;
				}
			}

			self.pageSet(self.cur);
		}, 

		pageSet: function(cur){
			var self = this;
				// indexLi = self.index.childNodes;

			self.slideWrap.style.transform = 'translateY(-' + self.cur * self.winHeight + 'px)';
			self.slideWrap.style.webkitTransform = 'translateY(-' + self.cur * self.winHeight + 'px)';

			for(var i=0; i<self.secNum; i++){
				// if(i===self.cur){
				// 	indexLi[i].setAttribute('class', 'cur');
				// }else{
				// 	indexLi[i].setAttribute('class', '');
				// }

				if(i===(self.cur-1)){
					document.querySelectorAll(self.secClass)[i].setAttribute('class', 'ar_sec prev');
				}else if(i===(self.cur+1)){
					document.querySelectorAll(self.secClass)[i].setAttribute('class', 'ar_sec next');
				}else{
					document.querySelectorAll(self.secClass)[i].setAttribute('class', 'ar_sec');
				}
			}

			setCookie('page', self.cur+1);
		}, 

		floatToggle: function(id, action){
			var self = this;

			if(action === 'open'){
				document.getElementById(id).style.display = 'block';
				// self.index.style.display = 'none';
				self.bar.style.display = 'none';
				document.getElementById(id).setAttribute('class', 'ar_mask mask_show');
				lazyLoad(document.getElementById(id), document.querySelectorAll(self.detailClass));
			}else if(action === 'close'){
				document.getElementById(id).setAttribute('class', 'ar_mask mask_hide');
				// self.index.style.display = 'block';
				setTimeout(function(){
					document.getElementById(id).style.display = 'none';
					self.bar.style.display = 'block';
				}, 400);
			}
		}
	};
	return Slides;
}
	