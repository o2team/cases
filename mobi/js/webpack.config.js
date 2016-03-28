module.exports = {
	entry: "./controllers_maga.js", 
	output: {
		path: __dirname, 
		filename: "bundle.js"
	}, 
	module: {
		loaders: [
			{test: /\.js$/, loader: 'jsx-loader?harmony'}
		]
	}
}