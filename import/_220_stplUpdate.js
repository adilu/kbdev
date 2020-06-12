const {readFile, writeFile, readdir} = require("fs").promises

const PATHS = require("./paths")

async function stplUpdate(SJ) {
	const PATHTOEXTRACTED = PATHS.getStplRaw(SJ)
	let extracted = await readdir(PATHTOEXTRACTED)
	let newest = extracted.filter(f=>f.endsWith(".txt")&&f.startsWith("extracted_")).sort().reverse()[0]
	let newestContent = newest ? await readFile(PATHTOEXTRACTED + "/" + newest, "UTF-8") : ""
	let candidateContent = await readFile(PATHS.getStplRawLatestCopy(SJ) + "/gpp002.txt", "UTF-8")
	console.log(`Server content ready: reading ${candidateContent.split("\n").length} lines`)
	if(candidateContent.length < 1000) throw new Error("Server file too small.")
	const newFileFound = newestContent !== candidateContent
	if(newFileFound) {
		await writeFile(PATHTOEXTRACTED + "/" + "extracted_" + Date.now() + ".txt", candidateContent)
	}
	console.log(newFileFound ? "New Data Found!": "No new data found...")
	return {newFileFound}
}

module.exports = {stplUpdate}