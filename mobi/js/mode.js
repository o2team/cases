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

		init: function(){
			var self = this, 
				picBtn = document.querySelector('.' + self.picMode), 
				textBtn = document.querySelector('.' + self.textMode), 
				modeCookie = self.getCookie('mode');

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
				picBtn.addEventListener('click', function(){
					self.setMode(this.getAttribute('data-mode'));
					self.modeVal = 0;
				});
				textBtn.addEventListener('click', function(){
					self.setMode(this.getAttribute('data-mode'));
					self.modeVal = 1;
				});
			}
		}, 

		setMode: function(modeString){
			var self = this, 
				modeClass = self.mode.getAttribute('class'); 

			self.secWrap.setAttribute('class', self.secWrapClass + ' ' + modeString);
			self.secWrap.setAttribute('data-mode', modeString);
			self.mode.setAttribute('class', modeClass + ' loaded');
			setTimeout(function(){
				self.mode.style.display = 'none';
			}, 200);

			document.cookie = "mode=" + self.modeVal;

			self.shakeIco.setAttribute('class', 'ar_shake ar_shaking');
			setTimeout(function(){
				self.shakeIco.style.opacity = 0;
			}, 300000);

		}, 

		shaking: function(){
			if(window.DeviceMotionEvent) {
				var speed = 25, //定义一个数值
					x = y = z = lastX = lastY = lastZ = 0, //重置所有数值
					modeString = '';
				window.addEventListener('devicemotion', function(){
				var acceleration =event.accelerationIncludingGravity;//将传感值赋给acceleration
				x = acceleration.x;
				y = acceleration.y;
				z = acceleration.z;
				if(Math.abs(x-lastX) > speed || Math.abs(y-lastY) > speed ) {
					if(self.modeVal){
						self.modeVal = 0;
						modeString = "pic_mode";
					}else{
						self.modeVal = 1;
						modeString = 'text_mode';
					}
					self.setMode(modeString);
				}
				lastX = x;
				lastY = y;
				lastZ = z;
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