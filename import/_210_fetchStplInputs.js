const {ftpsClient} = require("./importhelpers/ftpsClient")
const {colors} = require("./importhelpers/colors")
const {createFolderIfNotExists} = require("./importhelpers/createFolderIfNotExists.js")


async function fetchStplInputs(SJ, isTest = false) {
	const PATHS = isTest ? require("./paths_test") : require("./paths")
	console.log(colors.bg.Cyan, colors.fg.Black, "Polling for STPL updates at stplinput", colors.Reset)
	const client = await ftpsClient("web/stplinput/"+SJ, isTest)
	console.log("Loading files from server...")
	createFolderIfNotExists(PATHS.getStplRawLatestCopy(SJ))
	console.log(PATHS.getStplRawLatestCopy(SJ))
	await client.downloadToDir(PATHS.getStplRawLatestCopy(SJ))
	client.close()
}

module.exports = {fetchStplInputs}