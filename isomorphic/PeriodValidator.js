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

class PeriodValidator extends PeriodReader {

	constructor(key, changeWatcherPath = "") {
		super(key)
		this.path = changeWatcherPath
		this.counter = 0
	}

	extractChangewatcherName(entry) {
		if(this.key === "susToCourse") return `${this.path}/susToCourse-${entry[0]}-${entry[1]}.json`
		if(this.key === "susToClass") return `${this.path}/susToClass-${entry[0]}-${entry[1]}.json`
		if(this.key === "suslist") return `${this.path}/sid-${entry.sid}.json`
		if(this.key === "courselist") return `${this.path}/cid-${entry.cid}.json`
		console.log("add Changewatcher name?", this.key, entry)
		return ""
	}

	updateValidPeriod(object, value) {

		const {existsSync, readFileSync, writeFileSync} = require("fs")

		//if(value < 0) console.log({object, v: getValidArray(object)})

		let currentTimestamp = value[2]
		let replaceObj = {validPeriod: this.getFrom(object).concat([value])}
		let cnw = this.extractChangewatcherName(object)
		if(existsSync(cnw)) {
			let {importcheck: {timestamp, comment}, validPeriod} = JSON.parse(readFileSync(cnw, "utf-8"))
			//console.log({timestamp, comment, validPeriod})
			if(timestamp >= currentTimestamp) {
				replaceObj = {importcheck: {timestamp, comment}, validPeriod}
			}
			else {
				this.counter++
				writeFileSync(cnw, JSON.stringify({importcheck: {timestamp, comment}, validPeriod, validPeriodAuto: replaceObj.validPeriod}), "UTF-8")
			}
		}
		else {
			this.counter++
			writeFileSync(cnw, JSON.stringify({importcheck: false, validPeriodAuto: replaceObj.validPeriod}), "UTF-8")
		}
		Array.isArray(object)
			? object[2] = replaceObj
			: Object.assign(object, replaceObj)
	}
	
	check(data) {
		const {writeFileSync} = require("fs")
		Object.entries(data).forEach(([key, check]) => {
			writeFileSync(`${this.path}/${key}.json`, JSON.stringify(check), "UTF-8")
		})
	}

	addAfter(object, jsw, timestamp) {
		console.assert(this.getFrom(object).length === 0 || !this.currentlyValid(object), `addAfter ${jsw} ${JSON.stringify(object)}`)
		if(this.getFrom(object).length === 0) {
			this.updateValidPeriod(object, ["-",0, timestamp])
		}
		this.updateValidPeriod(object, ["+",jsw, timestamp])
	}
	removeAfter(object, jsw, timestamp) {
		console.assert(this.currentlyValid(object))
		this.updateValidPeriod(object, ["-",jsw, timestamp])
	}
}

try {
	module.exports = exports = {PeriodValidator, PeriodReader}
} catch (e) {
	// noinspection JSUnusedLocalSymbols
	let x = 0
}
