const fxy = require('fxy')
const query = require('qs')
const source_locator = (protocol='http', parameters)=>`${protocol}://data.fixer.io/api/latest?${parameters}`
const rates = {
	update(date){ return this.date !== date },
	get data(){ return 'data_rates' in this ? this.data_rates:require('./converts') },
	set data(data){ return this.data_rates = data },
	get http(){ return require(this.protocol) },
	get locator(){ return get_locator() },
	get protocol(){ return this.options.license === 'paid' ? 'https':'http' }
}

//exports
module.exports = get_rates

//shared actions
function get_locator(){
	return source_locator(rates.protocol, query.stringify(rates.options.parameters))
}

function get_options(options){
	if(!options){
		const location = fxy.join(process.cwd(), 'app.json')
		if(!fxy.exists(location)) throw new Error(`Missing API access: currency.order requires options for "fixer.io" to access exchange rates.  Add a fixer.io account info to the "api" object in an "app.json" file in the top-level directory of the project or provide an options object when accessing the rates module.`)
		options = require(location).api['fixer.io']
	}
	return options
}

async function get_rates(options=null){
	if('options' in rates !== true) rates.options = get_options(options)
	if(!rates.loading && is_expired()){
		if('date' in rates) rates.last = rates.date
		rates.data = await load_rates()
		rates.date = new Date()
	}
	return rates
}

function load_rates(){
	let data = ''
	rates.loading = true
	return new Promise((success,error)=>{
		return process.nextTick(()=>{
			return rates.http.get(rates.locator, response=>{
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
