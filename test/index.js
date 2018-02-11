const {bundle,ChronologicalOrder} = require('../package/index')
const api_key = 'AIzaSyAqsYk_afj-3fh6ALDD_hd64lSgCFdUIBk'
const input = {
	"name": "Armenia",
	"coordinates": {
		"latitude": 40.13475528,
		"longitude": 45.01072318
	}
}

test().then(result=>{

}).catch(error=>{
	console.error(error)
})

async function test(){
	const timezone = await bundle.timezone(input,api_key)
	console.dir(timezone,{depth:5,colors:true})
}

