const {fetchStplInputs} = require("./_210_fetchStplInputs")
const {stplUpdate} = require("./_220_stplUpdate")
const {stplExtract, extractHistory, printStplPdfs} = require("./_230_stplExtract")
const {fetchEventoApi} = require("./_310_evento")
const {handleEventoData} = require("./_320_eventoExtract")
const {eventoMerge} = require("./_330_eventoMerge")
const PATHS = require("./paths")
// const {copyData, moveDevToProduction} = require("./transferFiles");
// const {printStplPdfs} = require("./printStplPdfs");

const {compressDir} = require("./importhelpers/compressor")

// const uploadChanges = !process.platform.startsWith("win");
// const forceUpload = true;

async function importAll(SJ) {
	console.log(process.getuid ? process.getuid() : "undefined")
	await fetchStplInputs(SJ)
	//may be move DatenKB to correct /stpldata/year folder
	const {newFileFound} = await stplUpdate(SJ)
	const hasStplChanged = await stplExtract(SJ)

	//await compressDir("../../cacheSettingsTest")
	let {hasChanged, ...rest} = await fetchEventoApi(SJ)
	let haveFilesChanged = await handleEventoData(SJ)
	let d = await eventoMerge(SJ)
	//
	// await compressDir(PATHS.getStplRaw(SJ))
	// await compressDir(PATHS.getEventoRaw(SJ))
	await printStplPdfs(SJ)
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