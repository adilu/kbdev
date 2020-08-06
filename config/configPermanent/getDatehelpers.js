function getDatehelpers(SJ) {

	if(!SJ || SJ === "currentYear") {
		let d = new Date()
		let y = d.getFullYear() % 2000
		let m = d.getMonth() + 1
		SJ = m <= 7 ? "" + (y-1) + y : "" + y + (y+1)
	}

	const SJA = 2000 + parseInt(SJ.slice(0,2))
	const SJE = 2000 + parseInt(SJ.slice(2,4))

	const periods = [
		{
			short: "S1",
			name: "1. Semester",
			show: true,
			first: 0,
			last: 19
		},{
			short: "S2",
			name: "2. Semester",
			show: SJE <= 2020,
			first: 20,
			last: 39
		},{
			short: "OP",
			name: "ohne Primen",
			show: SJE <= 2020,
			first: 31,
			last: 39
		}
	]

	const starttimes = ["07:30", "08:20", "09:15", "10:15", "11:10", "12:05", "13:00", "13:55", "14:50", "15:45", "16:40"]
	const endtimes   = ["08:15", "09:05", "10:00", "11:00", "11:55", "12:50", "13:45", "14:40", "15:35", "16:30", "17:25"]
	const weekdays = ["", "Mo", "Di", "Mi", "Do", "Fr"]
	const weekdaysLong = ["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]

	function isVacation(week) {
		//https://www.erz.be.ch/erz/de/index/kindergarten_volksschule/kindergarten_volksschule/informationen_fuereltern/schulferien.assetref/dam/documents/ERZ/AKVB/de/00_Allgemeines/allgemeines_volksschule_schulferien_schulferienplan_d.pdf
		const last = [2015, 2020, 2026, 2032, 2037, 2043].includes(SJA) ? 53 : 52
		const vacationWeeks = [1, 7, 15, 16, 28, 29, 30, 31, 32, 39, 40, 41, last]
		if(last===53) vacationWeeks.push(27) //6 Wochen Sommerferien
		return vacationWeeks.includes(week)
	}

	const weekArray = []
	let runningDate = new Date(SJA, 8-1, 1, 12,0,0) //1. August vor Schuljahresbeginn
	while(runningDate < new Date(SJE, 8-1, 1, 12,0,0)) {
		if(!isVacation(getWeek(runningDate))) {
			weekArray.push({week: getWeek(runningDate), year: getWeekYear(runningDate)})
		}
		runningDate.setDate(runningDate.getDate() + 7)
	}

	/**
	 *
	 * @param {Date} date
	 * @returns {number}
	 */
	function getWeek(date) {
		let target = new Date(date.valueOf())
		let dayNumber = (date.getDay() + 6) % 7
		target.setDate(target.getDate() - dayNumber + 3)
		let firstThursday = target.valueOf()
		target.setMonth(0, 1)
		if (target.getDay() !== 4) {
			target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
		}
		return Math.ceil((firstThursday - target) /  604800000) + 1 //604800000 = 7 * 24 * 3600 * 1000
	}

	/**
	 *
	 * @param {Date} date
	 * @returns {number}
	 */
	function getWeekYear(date) {
		let target = new Date(date.valueOf())
		target.setDate(target.getDate() - ((date.getDay() + 6) % 7) + 3) //Thursday of this week
		return target.getFullYear()
	}

	function getJSW(week, weekyear) {
		return weekArray.findIndex(w=>w.year === weekyear && w.week === week)
	}

	function getJSWfromDate(MMDD) {
		let p = MMDD.split(".")
		let month = +p[1]
		let day = +p[0]
		let date = new Date(month > 7 ? SJA : SJE, month-1, day)
		return getJSW(getWeek(date), getWeekYear(date))
	}

	function getTimeFromJSWday(jsw, weekday) {
		if(jsw===-1) console.warn("Invalid JSW")
		let {week, year} = weekArray[jsw]
		return getDateOfISOWeek(year, week, weekday).getTime()
	}

	function getDateOfISOWeek(year, week, weekday=1) {
		let DOb = new Date(year, 0, 3)  // Jan 3
		DOb.setDate( 3 - DOb.getDay() + (+week-1)*7 + weekday )
		return DOb
	}

	function semOfJSW(jsw) {
		return jsw <= periods.find(p=>p.short==="S1").last ? 1 : 2
	}

	function getLessonBoundaryFromTime(time) {
		return 1+0.5*Math.floor(2*(Math.floor(time/100)+(time%100)/60-8.3333+0.25)/0.92)
	}

	function timeToDDMM(time) {
		let d = new Date(time)
		return String(d.getDate()).padStart(2,"0") + "." + String(d.getMonth()+1).padStart(2,"0") + "."
	}

	function timeToYYYYMMDD(time) {
		let d = new Date(time)
		return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0")
	}

	function outOfBounds(date) {
		let [cw, cwy] = [getWeek(date), getWeekYear(date)]
		let [FW, LW] = [weekArray[0], weekArray.slice(-1)[0]]
		if(cwy < FW.year || (cwy === FW.year && cw < FW.week)) return +1
		if(cwy > LW.year || (cwy === LW.year && cw > LW.week)) return -1
		return 0
	}

	function getDateToShow(fromDate) {
		let datetoshow = fromDate || new Date(new Date().getTime()+2*86400000)
		let dir = outOfBounds(datetoshow)
		while(dir) {
			datetoshow = new Date(datetoshow.getTime() + dir*7*86400000)
			dir = outOfBounds(datetoshow)
		}
		return datetoshow
	}

	function switchWeek(dateToShow, offset) {
		return new Date(dateToShow.getTime() + 7*offset*86400000)
	}

	const beautify = (time) => String(time).slice(0,-2) + ":" + String(time).slice(-2)

	return {
		SJ, SJA, SJE,
		weekArray, periods,
		starttimes, endtimes,
		weekdays, weekdaysLong,
		isVacation,
		getWeek, getWeekYear,
		getJSW, getTimeFromJSWday, getJSWfromDate,
		getDateOfISOWeek,
		getLessonBoundaryFromTime,
		timeToDDMM, timeToYYYYMMDD,
		outOfBounds, semOfJSW, getDateToShow, switchWeek, beautify
	}
}

//const Datehelpers = {SJA, SJE, istFerien, getWeek, getWeekYear, weekArray, starttimes, endtimes, weekdays, weekdaysLong, getJSW, getTimeFromJSWday, getLektionsgrenzeFromTime, timeToDDMM, timeToYYYYMMDD, outOfBounds, semOfJSW, getDateToShow, switchWeek, beautify}

// Support Node.js specific `module.exports` (which can be a function)
if (typeof module !== "undefined" && module.exports) {
	exports = module.exports = {getDatehelpers}
}
// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
if (typeof exports !== "undefined") {
	exports.MyModule = {getDatehelpers}
}
