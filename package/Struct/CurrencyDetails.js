const bundle = require('../bundle')
const Conversion = require('./CurrencyConversion')
const Format = require('./CurrencyFormat')
class CurrencyDetails{
	constructor(data){ Object.assign(this,data) }
	convert({value}){
		console.dir({value},{colors:true,depth:4})
		const conversion = { to:this.code,  value:bundle.value(value) }
		return this.exchange_rate.to(conversion)
	}
	get format(){ return new Format(this.code) }
	get exchange_rate(){ return require('./CurrencyExchangeRate') }
	async to({conversion}){
		if(!this.converts) return null
		console.dir({conversion},{colors:true,depth:4})
		if(conversion.to === this.code) return Conversion(this.code,conversion)
		const converted = await convert(this,conversion)
		if(converted) return Conversion(this.code,converted)
		return null
	}
}

//exports
module.exports = CurrencyDetails


//shared action
function convert(currency, conversion){
	return new Promise((success,error)=>{
		return process.nextTick(()=>{
			return bundle.converter()
						 .then(converter=>{
							 if(!converter.exists(conversion.to)) return null
							 conversion.value = converter.convert(conversion.value,{from:currency.code,to:conversion.to})
							 return conversion
						 })
						 .then(success)
						 .catch(error)
		})
	})
}