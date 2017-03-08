// author: EC
// last modify: 2015-12-25 16:50

	var Mode = {
		mode: document.querySelector('.choose'), //视图选择浮层
		picMode: 'ch_pic', //图片模式类名
		textMode: 'ch_text', //文字模式类名
		secWrap: document.querySelector('.article'), //设置类容器
		secWrapClass: 'page article', //容器原类名
		// shakeIco: document.querySelector('.ar_shake'), //摇一摇提示图标
		modeVal: 1, //模式值，{1:文字, 0:图片}
		sound: 'img/sound.mp3', //切换模式音频地址

		init: function(){
			var self = this, 
				picBtn = document.querySelector('.' + self.picMode), 
				textBtn = document.querySelector('.' + self.textMode), 
				modeCookie = getCookie('mode');

			self.setAudio();

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

		// 设置切换音频
		setAudio: function(){
			var self = this;
			self.audio = new Audio();
			self.audio.src = self.sound;
			self.audio.autoplay = false;
			self.audio.preload = true;
		}, 

		// 设置视图模式
		setMode: function(modeString){
			var self = this, 
				modeClass = self.mode.getAttribute('class'); 

			self.audio.play();

			self.secWrap.setAttribute('class', self.secWrapClass + ' ' + modeString);
			self.secWrap.setAttribute('data-mode', modeString);
			self.mode.setAttribute('class', modeClass + ' loaded');
			setTimeout(function(){
				self.mode.style.display = 'none';
			}, 800);

			setCookie("mode", self.modeVal);

			// self.shakeIco.setAttribute('class', 'ar_shake ar_shaking');

			// setTimeout(function(){
			// 	self.shakeIco.style.display = 'none';
			// }, 5000);
		}, 

		// 摇动手机
		shaking: function(){
			var self = this;

			if(window.DeviceMotionEvent) {
				var speed = 1000, //定义一个数值
					x = y = 0, //重置所有数值
					modeString = '', 
					modified = 0;

				window.addEventListener('devicemotion', function(){
					if(!modified){
						var acceleration =event.accelerationIncludingGravity;						//将传感值赋给acceleration
						x = acceleration.x;
						y = acceleration.y;
						if(x*x + y*y > speed) {
							// self.shakeIco.style.display = 'none';

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
		}
	}