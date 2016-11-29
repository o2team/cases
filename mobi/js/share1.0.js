	/**
	* 微信分享
	*/
	
	var wxShare = function(img_url,img_width,img_height,link,title,desc,callback,appid){
	    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	        WeixinJSBridge.on('menu:share:timeline', function(argv){
	            WeixinJSBridge.invoke('shareTimeline',{
	                "img_url":img_url,
	                "img_width":img_width,
	                "img_height":img_height,
	                "link":link,
	                "title": title,
	                "desc":desc
	            }, function() {
	                callback('timeline');
	            });
	        });

	        WeixinJSBridge.on('menu:share:appmessage', function(argv){

	            WeixinJSBridge.invoke('sendAppMessage',{
	                "appid":appid || "",
	                "img_url":img_url,
	                "img_width":img_width,
	                "img_height":img_height,
	                "link":link,
	                "title": title,
	                "desc":desc
	            }, function() {
	                callback('appmessage');
	            })

	        });


	        WeixinJSBridge.on('menu:share:weibo', function(argv){
	          WeixinJSBridge.invoke('shareWeibo',{
	             "content":title,
	             "url":link
	          }, function(res){
	            callback('weibo');
	          });
	        });

	        WeixinJSBridge.on('menu:share:facebook', function(argv){
	          (dataForWeixin.callback)();
	          WeixinJSBridge.invoke('shareFB',{
	                "img_url":img_url,
	                "img_width":img_width,
	                "img_height":img_height,
	                "link":link,
	                "title": title,
	                "desc":desc
	          }, function(res){
	            callback('facebook');
	          });
	        });

	    })
	}
	