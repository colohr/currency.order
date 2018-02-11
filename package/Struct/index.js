const sxy = require('sxy')
const fxy = require('fxy')
const converter = require('./convert')
const formatter = require('currency-formatter')

class CurrencyFormat extends sxy.Point(__filename,'CurrencyFormat'){}

class Currency{
	static get codes(){ return formatter.currencies.map(item=>item.code) }
	static format(code){ return new CurrencyFormat(formatter.currencies.filter(item=>item.code===code)[0]) }
	static get formats(){ return formatter.currencies.map(code=>this.format(code)) }
	constructor(base_code = 'EUR'){
		this.base_code = base_code
	}
	async convert(input){
		if(!fxy.is.data(input)) input = {}
		let {base,value,code}= input
		if(!code) code = 'USD'
		const convert = await converter()
		value = get_decimal_value(value)
		console.dir(convert.rates,{colors:true,depth:5})
		//if(base) new Currency(base).convert({value,code})
		this.code = code
		this.value =  convert.money(value).to(code)

		return this
	}
	format(input){
		if(!fxy.is.data(input)) input = {type:'code'}
		let {type,type_value} = input
		const option = {}
		if(!type_value) type_value = this[type]
		option[type] = type_value
		return formatter.format(this.value,option)
	}
	get formatting(){ return this.constructor.format(this.code || this.base_code || 'USD') }
	get text(){ return this.format() }
	toString(){ return `${this.text}` }
}

//shared actions
module.exports = Currency

//shared actions
function get_decimal_value(value){
	if(fxy.is.text(value)) value = parseFloat(value)
	if(!fxy.is.number(value)) value = 0
	return value
}