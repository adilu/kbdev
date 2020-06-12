const SJ = process.argv[2]

if(["1920"].includes(SJ)) {
	console.log(SJ)
	const {importAll} = require("./importAll")
	importAll(SJ)
}
else {
	console.log("please enter valid year as process arguments")
}
