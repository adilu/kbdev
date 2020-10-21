class PeriodReader {
	constructor(key) {
		this.key = key
	}

	getFrom(object) {
		return (Array.isArray(object) ? (object[2]||{}).validPeriod : object.validPeriod) || []
	}

	currentlyValid(object) {
		let validPeriod = this.getFrom(object)
		return validPeriod.length === 0 || validPeriod[validPeriod.length - 1][0] === "+"
	}

	validInSw(object, sw) {
		let validPeriod = this.getFrom(object)
		validPeriod = validPeriod.filter(change=>change[1] <= sw)
		return validPeriod.length === 0 || validPeriod[validPeriod.length - 1][0] === "+"
	}
}

try {
	module.exports = exports = {PeriodReader}
} catch (e) {
	// noinspection JSUnusedLocalSymbols
	let x = 0
}
