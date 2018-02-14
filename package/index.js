module.exports = {
	get converter(){ return require('./converter') },
	get formatter(){ return require('./formatter') },
	get Struct(){ return require('./Struct') },
	get rates(){ return require('./rates') }
}