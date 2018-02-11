

module.exports = Global.io.Currency =  {
	currency(_,input){
		const Currency = require('./')
		console.dir(input,{colors:true})
		return new Currency().convert(input)
	}
}