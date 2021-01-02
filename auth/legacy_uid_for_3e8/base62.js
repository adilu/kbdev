const CHARACTER_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
//File.sort not equals JS.sort !!! better use B36


/**
 *
 * @param {Number} int
 * @param {Number||Boolean} zeropad - Defaults to false
 * @returns {string}
 */
function intToB62(int, zeropad=false){
	var integer = Math.round(int)
	var s = integer===0 ? "0" : ""
	while (integer > 0) {
		s = CHARACTER_SET[integer % 62] + s
		integer = Math.floor(integer/62)
	}
	return zeropad ? ("0000000000000000000000000000000"+s).slice(-zeropad) : s
}

/**
 *
 * @param {string} base62String
 * @returns {Integer}
 */
function b62ToInt(base62String) {
	var val = 0
	var base62Chars = base62String.split("").reverse()
	base62Chars.forEach(function(character, index){
		val += CHARACTER_SET.indexOf(character) * Math.pow(62, index)
	})
	return val
}

/**
 *
 * @param {Date} date
 * @returns {String}
 */
function dateToB62(date = new Date()) {
	return intToB62(date.getTime())
}

/**
 *
 * @param {string} base62String
 * @returns {Date}
 */
function b62ToDate(base62String) {
	return new Date(b62ToInt(base62String))
}

module.exports = {intToB62, b62ToInt, dateToB62, b62ToDate}