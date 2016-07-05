module.exports = {
	entry: {
		maga: "./controllers_maga.js", 
		list: "./controllers_list.js"
	}, 
	output: {
		path: __dirname + '/build', 
		filename: "[name].js"
	}, 
	module: {
		loaders: [
			{test: /\.js$/, loader: 'jsx-loader?harmony'}
		]
	}
}