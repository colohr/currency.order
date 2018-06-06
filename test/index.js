const currency = require('../package/index')
const api_options = {
	parameters:{
		access_key: '3b42f19c72cde18f53aa57231dfca20f',
		format:1
	}
}



test().then(result=>{

}).catch(error=>{
	console.error(error)
})

async function test(){
	const api = await currency.rates(api_options)
	console.dir(api,{depth:5,colors:true})
}

