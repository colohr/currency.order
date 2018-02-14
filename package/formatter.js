const formatter = require('currency-formatter')
const Formatter = {
	get codes(){ return formatter.currencies.map(item=>item.code) },
	exists(code){ return this.codes.includes(code) },
	get(...x){ return formatter.format(...x) },
	format(code){ return formatter.currencies.filter(item=>item.code===code)[0] },
	formats(){ return formatter.currencies.map(code=>this.format(code)) }
}

//exports
module.exports = Formatter