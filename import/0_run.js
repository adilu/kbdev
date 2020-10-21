const SJ = process.argv[2]
const which = process.argv[3] || "all"
const {importAll, importStplOnly, importEventoOnly} = require("./importAll")
const {loadCalendarData} = require("./loadCalendarData.js")

if(["1920", "2021"].includes(SJ)) {
	console.log(which, SJ)
	which === "stpl" ? importStplOnly(SJ) : which === "evento" ? importEventoOnly(SJ) : importAll(SJ)
	loadCalendarData(SJ)
}
else {
	console.log("please enter valid year as process arguments")
}
