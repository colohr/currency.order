const bundle = require('../bundle')
const Currency = {
	get Conversion(){ return require('./CurrencyConversion') },
	get Details(){ return require('./CurrencyDetails') },
	get Format(){ return require('./CurrencyFormat') },
	get ExchangeRate(){ return require('./CurrencyExchangeRate') }
}

//exports
module.exports = get_currency()

//shared actions
function get_currency(){
	return new Proxy(get_currency_details,{
		get:get_value,
		has:has_value
	})
	//shared actions
	function get_value(o,field){
		if(typeof field === 'string') {
			if(field in Currency) return Currency[field]
			else if(field.replace('Currency','') in Currency){
				return Currency[field.replace('Currency','')]
			}
		}
		let value = field in o ? o[field]:null
		if(typeof value === 'function') value = value.bind(o)
		return value
	}
	function has_value(o,field){ return field in Currency || field in o }
}

async function get_currency_details(code){
	if(bundle.formatter.exists(code)){
		const data = { code, converts: (await bundle.converter()).exists(code) }
		if(data.converts) data.value = (await Currency.ExchangeRate.to({value:1,to:data.code})).value
		else data.value = 1
		return new Currency.Details(data)
	}
	return null
}