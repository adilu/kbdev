const path = require("path")

const PATHS = {
	stplinput_copy: path.join(process.cwd(), "stplinput_copy_test"),
	Datehelpers: path.join(process.cwd(), "stplinput_copy", "Datehelpers.js"),
	extractedStpl: path.join(process.cwd(), "stpl_extractedVersions"),
	eventoExtractedVersions: path.join(process.cwd(), "evento_extractedVersions"),
	eventoResultsJson: path.join(process.cwd(), "evento_extractedVersions", "evento_result.json"),
	data: path.join(process.cwd(), "data"),
	importSettings: path.join(process.cwd(), "config", "importSettings"),
	join: path.join.bind(path)
}

PATHS.lp = path.join(PATHS.data, "lp.json")
PATHS.current = path.join(PATHS.data, "current.json")

module.exports = PATHS