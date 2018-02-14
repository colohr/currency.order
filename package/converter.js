const rates = require('./rates')
const Money = require('money')
//npm install accounting-js
const conversion = {
	get exchange(){ return load_exchange() },
	get money(){ return Money }
}

//exports
module.exports = converter

//shared actions
function converter(){
	return new Promise((success,error)=>{
		try{
			return process.nextTick(async ()=>{
				try{
					const money = await load_exchange()
					return success({
						get conversion(){ return conversion },
						convert(...x){ return money.convert(...x) },
						exists(code){ return code in Money.rates },
						get base(){ return this.conversion.base },
						value(value){ return money(value) }
					})
				}
				catch(e){ return error(e) }
			})
		}
		catch(e){return error(e)}
	})
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

