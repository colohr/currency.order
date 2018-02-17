module.exports = {
	get converter(){ return require('./converter') },
	get converts(){ return require('./converts') },
	get formatter(){ return require('./formatter') },
	get Struct(){ return require('./Struct') },
	get rates(){ return require('./rates') }
}