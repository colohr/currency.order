const bundle = require('../bundle')
const Convert = (from,{to,value})=>({
	formatted:bundle.formatter.get(value,{code:to}),
	from,
	to,
	value,
	toString(){ return `${this.formatted}` }
})

//exports
module.exports = Convert