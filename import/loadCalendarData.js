const fs = require("fs")
const https = require("https")
const {getDatehelpers} = require("../config/configPermanent/getDatehelpers.js")
const {loadSecret} = require("../isomorphic/loadSecret.js")
const {createFolderIfNotExists} = require("./importhelpers/createFolderIfNotExists.js")
const {overwriteIfChanged} = require("./importhelpers/overwriteIfChanged.js")
const {compressDir} = require("./importhelpers/compressor.js")
const PATHS = require("./paths")

let api_key = loadSecret("calendar_api_key")

function fetchCalendarData(SJE) {
	return new Promise((resolve, reject) => {
		https.get(`https://www.googleapis.com/calendar/v3/calendars/kalender%40gymburgdorf.ch/events?orderBy=startTime&singleEvents=true&timeMax=${SJE}-08-01T00%3A00%3A00.000Z&timeMin=${SJE-1}-08-01T00%3A00%3A00.000Z&key=${api_key}`,
			(response) => {
				let d = ""
				response.on("data", (chunk) => {
					d += chunk
				})
				response.on("end", () => {
					resolve(JSON.parse(d))
				})
			}).on("error", (error) => {
			console.log("Error: " + error.message)
			reject(error)
		})
	})
}

function reduceEnddate(datehelpers, enddate) {
	let d = new Date(enddate + "T00:00:00")
	d.setTime(d.getTime()-86400000)
	return datehelpers.timeToYYYYMMDD(d.getTime())
}

async function saveCalendarData(calendarData, SJ) {
	let calendarPath = PATHS.getCalendarPath(SJ)
	await createFolderIfNotExists(calendarPath)
	await overwriteIfChanged(PATHS.join(calendarPath, "calendarData.json"), JSON.stringify(calendarData))
	await compressDir(calendarPath)
}

async function loadCalendarData(SJ) {
	let datehelpers = getDatehelpers(SJ)
	let calendarData = {}
	function addItem(yyyymmdd, item) {
		if(!item.summary || item.summary.match(/Office hour/i)) return
		calendarData[yyyymmdd] = calendarData[yyyymmdd] || []
		calendarData[yyyymmdd].push(
			(item.start.dateTime ? (item.start.dateTime.slice(11, 16) + " ") : "") + item.summary
		)
	}
	try {
		let data = await fetchCalendarData(datehelpers.SJE)
		for (let item of data.items) {
			let date = (item.start.date || item.start.dateTime).slice(0, 10)
			let enddate = (item.end.date || item.end.dateTime).slice(0, 10)
			enddate = reduceEnddate(datehelpers, enddate)
			while(enddate > date) {
				addItem(enddate, item)
				enddate = reduceEnddate(datehelpers, enddate)
			}
			addItem(date, item)
		}
		if(Object.keys(calendarData).length < 5) {
			console.warn("calendarData too short", calendarData)
			return
		}
		await saveCalendarData(calendarData, datehelpers.SJ)
		return calendarData
	}
	catch(e) {
		console.warn("loading calendarData failed", e.message)
	}

}

if(require.main === module /*call from fommandLine*/ ) {
	loadCalendarData("currentYear").then(console.log)
}

module.exports = {loadCalendarData}