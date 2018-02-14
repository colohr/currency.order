const sxy = require('sxy')
const bundle = require('../bundle')
class CurrencyFormat extends sxy.ModulePoint({process,__filename},'CurrencyFormat'){
	constructor(code){
		super(bundle.formatter.format(code))
	}
}

//exports
module.exports = CurrencyFormat