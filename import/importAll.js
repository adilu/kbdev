const {fetchStplInputs} = require("./_210_fetchStplInputs")
const {stplUpdate} = require("./_220_stplUpdate")
const {stplExtract, extractHistory, printStplPdfs} = require("./_230_stplExtract")
const {fetchEventoApi} = require("./_310_evento")
const {handleEventoData} = require("./_320_eventoExtract")
const {eventoMerge} = require("./_330_eventoMerge")
const PATHS = require("./paths")
// const {copyData, moveDevToProduction} = require("./transferFiles");

const {compressDir} = require("./importhelpers/compressor")

// const uploadChanges = !process.platform.startsWith("win");
// const forceUpload = true;

async function importAll(SJ) {
	await importStpl(SJ)
	await importEvento(SJ)
	await uploadAndPrint(SJ)
}

async function uploadAndPrint(SJ) {
//await compressDir("../../cacheSettingsTest")
	//
	// await compressDir(PATHS.getStplRaw(SJ))
	// await compressDir(PATHS.getEventoRaw(SJ))
	// await printStplPdfs(SJ)

	await compressDir(PATHS.getEventoMergedData(SJ))
	await compressDir(PATHS.getStplCurrent(SJ))
	await compressDir(PATHS.getPdfPath(SJ))
	// if(uploadChanges && (hasStplChanged || haveFilesChanged || hasChanged || forceUpload)) {
	// 	await copyData(SJ);
	// 	try {
	// 		await printStplPdfs(SJ);
	// 	}
	// 	catch(e) {console.log(`Currently no print (proxy?)`);}
	// }
	// if(uploadChanges) {
	// 	await moveDevToProduction(SJ);
	// }
}

async function importStplOnly(SJ) {
	await importStpl(SJ)
	await uploadAndPrint(SJ)
}

async function importEventoOnly(SJ) {
	await importEvento(SJ)
	await uploadAndPrint(SJ)
}

async function importStpl(SJ) {
	await fetchStplInputs(SJ)
	//may be move DatenKB to correct /stpldata/year folder
	const {newFileFound} = await stplUpdate(SJ)
	const hasStplChanged = await stplExtract(SJ)
}

async function importEvento(SJ) {
	let {hasChanged, ...rest} = await fetchEventoApi(SJ)
	let haveFilesChanged = await handleEventoData(SJ)
	let d = await eventoMerge(SJ)
}

module.exports = {importAll, importEventoOnly, importStplOnly}