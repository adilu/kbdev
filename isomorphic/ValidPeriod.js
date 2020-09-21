class ValidPeriod {

	constructor(key, changeWatcherPath = "") {
		this.key = key
		this.path = changeWatcherPath
	}

	getFrom(object) {
		return (Array.isArray(object) ? (object[2]||{}).validPeriod : object.validPeriod) || []
	}

	currentlyValid(object) {
		let validPeriod = this.getFrom(object)
		return validPeriod.length === 0 || validPeriod[validPeriod.length - 1][0] === "+"
	}

	extractChangewatcherName(entry) {
		if(this.key === "susToCourse") return `${this.path}/s2c-${entry[0]}-${entry[1]}.json`
		if(this.key === "susToClass") return `${this.path}/s2class-${entry[0]}-${entry[1]}.json`
		if(this.key === "suslist") return `${this.path}/sid-${entry.sid}.json`
		if(this.key === "courselist") return `${this.path}/cid-${entry.cid}.json`
		console.log("add Changewatcher name?", this.key, entry)
		return ""
	}

	updateValidPeriod(object, value) {

		const {existsSync, readFileSync} = require("fs")

		//if(value < 0) console.log({object, v: getValidArray(object)})

		let currentTimestamp = value[2]
		let replaceObj = {validPeriod: this.getFrom(object).concat([value])}
		let cnw = this.extractChangewatcherName(object)
		//console.log(cnw)
		if(existsSync(cnw)) {
			let {importcheck: {timestamp, comment}, validPeriod} = JSON.parse(readFileSync(cnw, "utf-8"))
			console.log({timestamp, comment, validPeriod})
			if(timestamp >= currentTimestamp) {
				replaceObj = {importcheck: {timestamp, comment}, validPeriod}
			}
		}
		Array.isArray(object)
			? object[2] = replaceObj
			: Object.assign(object, replaceObj)
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
	module.exports = exports = {ValidPeriod}
} catch (e) {
	// noinspection JSUnusedLocalSymbols
	let x = 0
}
