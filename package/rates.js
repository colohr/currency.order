const http = require('https')
const source_locator = 'https://api.fixer.io/latest'
const rates = {
	update(date){ return this.date !== date }
}
get_rates().then(()=>{})

//exports
module.exports = get_rates

//shared actions
async function get_rates(){
	if(is_expired()){
		if('date' in rates) rates.last = rates.date
		rates.data = await load_rates()
		rates.date = new Date()
	}
	return rates
}


function load_rates(){
	if(rates.loading) return rates
	let data = ''
	rates.loading = true
	return new Promise((success,error)=>{
		return process.nextTick(()=>{
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
		})
		//shared actions
		function on_end(){
			try{
				delete rates.loading
				return success(JSON.parse(data))
			}
			catch(e) { return error(e) }
		}
		function on_error(e){ return error(e) }
	})
}

function is_expired(){
	if(!('date' in rates)) return true
	return (new Date()).toDateString() !== rates.date.toDateString()
}
