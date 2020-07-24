const {stplExtract, extractHistory} = require("./_230_stplExtract")

const SJ = process.argv[2]
extractHistory(SJ).then(x=>console.log("Done."))