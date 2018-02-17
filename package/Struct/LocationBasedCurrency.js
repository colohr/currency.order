const fxy = require('fxy')
const Details = require('./CurrencyDetails')
const bundle = require('../bundle')
const LocationBasedCurrency = Base => class extends Base{
	static get InterfaceSetting(){ return ['get_location_currency_code() => Currency Code','get_location_based_value() => Number'] }
	get location_currency_conversion(){ return get_location_based_currency_conversion(this) }
	location_value_for(input){ return get_location_value_for(this,input.code) }
}

//exports
module.exports = LocationBasedCurrency

//shared actions
function get_location_based_currency_conversion(type){
	let code = 'get_location_currency_code' in type ? type.get_location_currency_code():"EUR"
	let value = 'get_location_based_value' in type ? type.get_location_based_value():1
	code = get_valid_conversion_code(code)
	return {
		code,
		details:new Details({code}),
		value:fxy.is.number(value) ? value:1
	}
}

async function get_location_value_for(type,code){
	code = get_valid_conversion_code(code)
	const currency_conversion = get_location_based_currency_conversion(type)
	//console.dir({currency_conversion,code},{colors:true,depth:5})
	const result = await currency_conversion.details.to({
		conversion:{
			to:code,
			value:currency_conversion.value
		}
	})
	//console.dir({result},{colors:true,depth:5})
	return result
}

function get_valid_conversion_code(code){
	if(code === bundle.converts.base) return code
	if(code in bundle.converts.rates) return code
	return 'EUR'
}