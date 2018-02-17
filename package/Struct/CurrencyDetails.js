const bundle = require('../bundle')
const Conversion = require('./CurrencyConversion')
const Format = require('./CurrencyFormat')
class CurrencyDetails{
	constructor(data){ Object.assign(this,data) }
	convert({value}){
		const conversion = { to:this.code,  value:bundle.value(value) }
		return this.exchange_rate.to(conversion)
	}
	get converts(){ return this.code in bundle.converts.rates || this.code === bundle.converts.base }
	get format(){ return new Format(this.code) }
	get exchange_rate(){ return require('./CurrencyExchangeRate') }
	async to({conversion}){
		if(!this.converts) return null
		if(conversion.to === this.code) return Conversion(this.code,conversion)
		const converted = await convert(this,conversion)
		if(converted) return Conversion(this.code,converted)
		return null
	}
	async value(){
		if(this.converts) return (await this.exchange_rate.to({value:1,to:this.code})).value
		return 1
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