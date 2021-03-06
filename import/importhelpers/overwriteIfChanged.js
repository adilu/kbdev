const {readFile, writeFile} = require("fs").promises
const {createFolderIfNotExists} = require("./createFolderIfNotExists.js")

/**
 * 
 * @param {*} filepath 
 * @param {*} content, currently only works for UTF-8
 */
async function overwriteIfChanged(filepath, content) {
	let oldContent = await readFile(filepath, "UTF-8").catch(e=>{}) || ""
	let hasChanged = content !== oldContent
	
	if(hasChanged) {
		createFolderIfNotExists(filepath)
		await writeFile(filepath, content)
	}
	return hasChanged
}

module.exports = {overwriteIfChanged}