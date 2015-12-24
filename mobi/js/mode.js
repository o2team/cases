// author: EC
// last modify: 2015-12-20 13:36

	var Mode = {
		mode: document.querySelector('.choose'), 
		picMode: 'ch_pic', 
		textMode: 'ch_text', 
		secWrap: document.querySelector('.article'), 
		secWrapClass: 'page article', 
		shakeIco: document.querySelector('.ar_shake'), 
		modeVal: 1, 
		sound: 'img/sound.mp3', 


		init: function(){
			var self = this, 
				picBtn = document.querySelector('.' + self.picMode), 
				textBtn = document.querySelector('.' + self.textMode), 
				modeCookie = self.getCookie('mode');

			self.audio = new Audio();
			self.audio.src = self.sound;
			self.audio.autoplay = false;
			self.audio.preload = true;

			if(modeCookie==='0' || modeCookie==='1'){
				var modeString = '';
				self.mode.style.display = 'none';
				if(modeCookie==='0'){
					self.modeVal = 0;
					modeString = 'pic_mode';
				}else if(modeCookie==='1'){
					self.modeVal = 1;
					modeString = 'text_mode';
				}
				self.setMode(modeString);
			}else{
				picBtn.addEventListener('touchstart', function(){
					self.setMode(this.getAttribute('data-mode'));
					self.modeVal = 0;
				});
				textBtn.addEventListener('touchstart', function(){
					self.setMode(this.getAttribute('data-mode'));
					self.modeVal = 1;
				});
			}			

			self.shaking();

		}, 

		setMode: function(modeString){
			var self = this, 
				modeClass = self.mode.getAttribute('class'); 

			self.audio.play();

			self.secWrap.setAttribute('class', self.secWrapClass + ' ' + modeString);
			self.secWrap.setAttribute('data-mode', modeString);
			self.mode.setAttribute('class', modeClass + ' loaded');
			setTimeout(function(){
				self.mode.style.display = 'none';
			}, 400);

			document.cookie = "mode=" + self.modeVal;

			self.shakeIco.setAttribute('class', 'ar_shake ar_shaking');
			// setTimeout(function(){
			// 	self.shakeIco.style.opacity = 0;
			// }, 300000);

		}, 

		shaking: function(){
			var self = this;

			if(window.DeviceMotionEvent) {
				var speed = 1000, //定义一个数值
					x = y = 0, //重置所有数值
					modeString = '', 
					modified = 0;

				window.addEventListener('devicemotion', function(){
					if(!modified){
						var acceleration =event.accelerationIncludingGravity;
						//将传感值赋给acceleration
						x = acceleration.x;
						y = acceleration.y;
						if(x*x + y*y > speed) {
							var curMode = self.modeVal;
							modified = 1;
							if(curMode === 1){
								self.modeVal = 0;
								modeString = "pic_mode";
							}else{
								self.modeVal = 1;
								modeString = 'text_mode';
							}

							self.setMode(modeString);
							setTimeout(function(){
								modified = 0;
							}, 1000);
						}
					}
				}, false);
			}
		}, 

		getCookie: function(name){
			var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr = document.cookie.match(reg)){
				return unescape(arr[2]);
			}
			else{
				return null;
			}
		}
	}