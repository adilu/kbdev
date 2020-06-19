const fs = require("fs")
const path = require("path")

function createFolderIfNotExists(pathToCreate) {
	if(!fs.existsSync(pathToCreate)) {
		let dirpath = path.extname(pathToCreate) !== "" ? path.dirname(pathToCreate) : pathToCreate
		fs.mkdirSync(dirpath, { recursive: true })
	}
}

module.exports = {createFolderIfNotExists}