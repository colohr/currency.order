const http = require('https')
const source_locator = 'https://api.fixer.io/latest'
const rates = {}

//exports
module.exports = convert

//shared actions
async function convert(){
	const money = await get_money()
	return {
		base:rates.data.base,
		get money(){ return money },
		get rates(){ return rates.data }
	}
}


async function get_money(){
	const money = require('money')
	if(is_expired()){
		rates.data = await get_rates()
		rates.date = new Date()
		money.rates = rates.data.rates
		console.log(money(5).to('USD'))
		
	}
	return money
}


function get_rates(){
	let data = ''
	return new Promise((success,error)=>{
		return http.get( source_locator, response=>{
			const status = response.statusCode
			const type = response.headers['content-type']
			if(status !== 200) return error(new Error(`Request Failed.\n Status Code: ${status}`))
			else if(!/^application\/json/.test(type)) return error(new Error(`Invalid content-type.\n Expected application/json but received ${type}`))
			response.resume()
			response.setEncoding('utf8')
			response.on('data', chunk => data += chunk )
			response.on('end', on_end)
		}).on('error', on_error)
		//shared actions
		function on_end(){
			try{ return success(JSON.parse(data)) }
			catch(e) { return error(e) }
		}
		function on_error(e){ return error(e) }
	})
}

function is_expired(){
	if(!('date' in rates)) return true
	return (new Date()).toDateString() !== rates.date.toDateString()
}

//npm install accounting-js
//let demo = () => {
//	let rate = fx(1).from("GBP").to("USD")
//	alert("£1 = $" + rate.toFixed(4))
//}
//
//fetch()
//	.then((resp) => resp.json())
//	.then((data) => fx.rates = data.rates)
//	.then(demo)