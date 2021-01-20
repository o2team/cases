exports.config = function(){
	var config = {
		data: [], 
		// qrIdPre = 'caseqc_', 
		h5type: [{"name": "其他", "id": 0}, 
			{"name": "游戏", "id": 1}, 
			{"name": "短片", "id": 2}, 
			{"name": "翻页动画", "id": 3}, 
			{"name": "多屏互动", "id": 4}], 			//案例类型表
		indexHref: 'maga.html', 					//索引地址
		$cover: document.querySelector('.cover'), 	//期刊封面钩子
		coverLoaded: 'page cover loaded', 			//加载完毕期刊封面类名
		sec: '.ar_sec', 							//每屏内容类
		indexLi: '.li_cover', 						//索引项类
		$indexCover: document.querySelector('.fcover'), //索引封面
		indexCoverLoaded: 'page fcover loaded', 	//加载完毕索引封面类名
		$magaBox: document.getElementById('magazines'), //期刊容器
		$indexBox: document.getElementById('index'), //索引容器
		likeClass: '.ar_love', 					//点赞类名
		indexJumpClass: ['.ar_list', '.bc_back'], 	//索引页入口按钮类名
		aotuBlue: ['A2C0F9', '6190e8'] 			//凹凸蓝
	}

	return config;
}