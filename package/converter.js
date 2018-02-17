const rates = require('./rates')
const Money = require('money')
const converts = require('./converts')
const conversion = {
	get exchange(){ return load_exchange() },
	get money(){ return Money }
}

//exports
module.exports = converter

//shared actions
async function converter(){
	const money = await load_exchange()
	return {
		get conversion(){ return conversion },
		convert(value,options){
			if(options.to === 'EUR') return Money.convert(value,{from:options.from})
			return Money.convert(value,options)
		},
		exists(code){ return code in converts.rates || code === converts.base },
		get base(){ return this.conversion.base },
		value(value){ return money(value) }
	}
}


async function load_exchange(){
	const exchange_rates = await rates()

	if(exchange_rates.update(conversion.date)){
		Money.rates = exchange_rates.data.rates
		conversion.base = exchange_rates.data.base
		conversion.date = exchange_rates.date
	}
	return Money
}

//npm install accounting-js