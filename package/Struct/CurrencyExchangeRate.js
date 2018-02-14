const bundle = require('../bundle')
const Conversion = require('./CurrencyConversion')
const ExchangeRate = {
	code:'EUR',
	async to(conversion){
		if(conversion.to === this.code) return Conversion(this.code,conversion)
		const converted = await convert(conversion)
		if(converted) return Conversion(this.code,converted)
		return null
	}
}

//exports
module.exports = ExchangeRate

//shared action
function convert(conversion){
	return new Promise((success,error)=>{
		return process.nextTick(()=>{
			return bundle.converter()
						 .then(converter=>{
						 	if(!converter.exists(conversion.to)) return null
						 	conversion.value = converter.value(conversion.value).to(conversion.to)
						 	return conversion
						 })
						 .then(success)
						 .catch(error)
		})
	})
}