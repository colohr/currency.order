const {is} = require('fxy')
const converter = require('./converter')
const formatter = require('./formatter')
const rates = require('./rates')

//exports
module.exports = {
	converter,
	get converts(){ return require('./converts') },
	formatter,
	rates,
	value:get_decimal_value
}

//shared actions
function get_decimal_value(value){
	if(is.text(value)) value = parseFloat(value)
	if(!is.number(value)) value = 0
	return value
}