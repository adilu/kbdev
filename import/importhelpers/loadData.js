let {readdir, readFile} = require("fs").promises
let path = require("path")
const PATHS = require("../paths")

async function loadExtractedLists(SJ) {
	let pathOfYear = PATHS.getEventoExtracts(SJ)
	let files = await readdir(pathOfYear)
	let data = {}
	for(let f of files.filter(f=>f.endsWith(".json"))) {
		data[f.slice(0, f.indexOf(".json"))] = JSON.parse(await readFile(path.join(pathOfYear, f), "UTF-8"))
	}
	return data
}

async function loadEventoMerged(SJ) {
	let pathOfYear = PATHS.getEventoMergedData(SJ)
	let files = await readdir(pathOfYear)
	let data = {}
	for(let f of files.filter(f=>f.endsWith(".json"))) {
		data[f.slice(0, f.indexOf(".json"))] = JSON.parse(await readFile(path.join(pathOfYear, f), "UTF-8"))
	}
	return data
}

async function loadStplHistory(SJ) {
	let pathOfYear = PATHS.getStplExtracts(SJ)
	let files = await readdir(pathOfYear)
	let data = {}
	for(let f of files.filter(f=>f.endsWith(".json"))) {
		data[f.slice(0, f.indexOf(".json"))] = JSON.parse(await readFile(path.join(pathOfYear, f), "UTF-8"))
	}
	return data
}

module.exports = {loadExtractedLists, loadEventoMerged, loadStplHistory}