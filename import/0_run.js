const SJ = process.argv[2]
const {importAll} = require("./importAll")

if(["1920", "2021"].includes(SJ)) {
	console.log(SJ)
	importAll(SJ)
}
else {
	console.log("please enter valid year as process arguments")
}
