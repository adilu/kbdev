const {stplExtract, extractHistory} = require("./_230_stplExtract")

//run from 1920 etc folder
extractHistory(process.cwd().slice(-4)).then(x=>console.log("Done."))