let {readdir, readFile} = require("fs").promises
let path = require("path")
const PATHS = require("../paths")

async function parseJsonDir(pathToJsons) {
	let files = await readdir(pathToJsons)
	let data = {}
	for(let f of files.filter(f=>f.endsWith(".json"))) {
		data[f.slice(0, f.indexOf(".json"))] = JSON.parse(await readFile(path.join(pathToJsons, f), "UTF-8"))
	}
	return data
}

async function loadExtractedLists(SJ) {
	return await parseJsonDir(PATHS.getEventoExtracts(SJ))
}

async function loadEventoMerged(SJ) {
	return await parseJsonDir(PATHS.getEventoMergedData(SJ))
}

async function loadStplHistory(SJ) {
	return await parseJsonDir(PATHS.getStplExtracts(SJ))
}

async function loadEventoChecks(SJ) {
	return await parseJsonDir(PATHS.getEventoChecks(SJ))
}

module.exports = {loadExtractedLists, loadEventoMerged, loadStplHistory, loadEventoChecks}