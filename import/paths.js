const path = require("path")
const DEV = process.platform.startsWith("win")

// const PATHS = {
// 	stplinput_copy: path.join(process.cwd(), "stplinput_copy"),
// 	Datehelpers: path.join(process.cwd(), "stplinput_copy", "Datehelpers.js"),
// 	extractedStpl: path.join(process.cwd(), "stpl_extractedVersions"),
// 	eventoExtractedVersions: path.join(process.cwd(), "evento_extractedVersions"),
// 	eventoResultsJson: path.join(process.cwd(), "evento_extractedVersions", "evento_result.json"),
// 	data: path.join(process.cwd(), "data"),
// 	root_data: DEV ? path.join(__dirname, "../root_data") : "/data",
// 	importSettings: path.join(process.cwd(), "config", "importSettings"),
// 	temporaryImportRules: path.join(process.cwd(), "config", "temporaryImportRules"),
// 	join: path.join.bind(path),
// 	projectRoot: path.join(__dirname, "../")
// }

const PATHS = {
	projectRoot: path.join(__dirname, "../"),
	root_data: DEV ? path.join(__dirname, "../root_data") : "/data"
}

PATHS.getConfigOfYear = (SJ) => path.join(PATHS.projectRoot, "config", SJ)
PATHS.getDatehelpers = (SJ) => path.join(PATHS.getConfigOfYear(SJ), "Datehelpers.js")
PATHS.getDataPathOfYear = (SJ) => path.join(PATHS.root_data, SJ)
PATHS.getEventoRaw = (SJ) => path.join(PATHS.root_data, SJ, "evento_raw")
PATHS.getEventoExtracts = (SJ) => path.join(PATHS.root_data, SJ, "evento_extracts")
PATHS.getEventoMergedData = (SJ) => path.join(PATHS.root_data, SJ, "merged")
PATHS.getStplRaw = (SJ) => path.join(PATHS.root_data, SJ, "stpl_raw")
PATHS.getStplRawLatestCopy = (SJ) => path.join(PATHS.root_data, SJ, "stpl_raw_latest_copy")
PATHS.getStplCurrent = (SJ) => path.join(PATHS.root_data, SJ, "stpl_current", "stpl.json")
PATHS.getStplExtracts = (SJ) => path.join(PATHS.root_data, SJ, "stpl_extracts")
PATHS.getLpList = (SJ) => path.join(PATHS.getConfigOfYear(SJ), "lp.json")
PATHS.getPdfPath = (SJ) => path.join(PATHS.root_data, SJ, "pdf")
//PATHS.getDatehelpers = (SJ) => path.join(__dirname, "stplinput_copy", "Datehelpers.js")

// PATHS.lp = path.join(PATHS.data, "lp.json")
// PATHS.current = path.join(PATHS.data, "current.json")

module.exports = PATHS