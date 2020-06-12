const {fetchStplInputs} = require("./fetchStplInputs")
// const {stplUpdate} = require("./stplUpdate");
// const {stplExtract} = require("./stplExtract");
// const {fetchEventoApi} = require("./evento");
// const {handleEventoData} = require("./eventoCourseHandler");
// const {copyData, moveDevToProduction} = require("./transferFiles");
// const {printStplPdfs} = require("./printStplPdfs");

// const uploadChanges = !process.platform.startsWith("win");
// const forceUpload = true;

async function importAll(sj) {
	await fetchStplInputs(sj, true)
	// //may be move DatenKB to correct /stpldata/year folder
	// const {newFileFound} = await stplUpdate();
	// const hasStplChanged = await stplExtract(sj);
	// let {hasChanged, ...rest} = await fetchEventoApi();
	// let haveFilesChanged = await handleEventoData();
	// if(uploadChanges && (hasStplChanged || haveFilesChanged || hasChanged || forceUpload)) {
	// 	await copyData(sj);
	// 	try {
	// 		await printStplPdfs(sj);
	// 	}
	// 	catch(e) {console.log(`Currently no print (proxy?)`);}
	// }
	// if(uploadChanges) {
	// 	await moveDevToProduction(sj);
	// }
}

module.exports = {importAll}