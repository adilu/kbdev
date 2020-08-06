const SJ = process.argv[2]
const {importAll} = require("./importAll")
const {loadCalendarData} = require("./loadCalendarData.js")

if(["1920", "2021"].includes(SJ)) {
	console.log(SJ)
	importAll(SJ)
	loadCalendarData(SJ)
}
else {
	console.log("please enter valid year as process arguments")
}
