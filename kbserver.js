var express = require("express")
var expressStaticGzip = require("express-static-gzip")
//var proxy = require('express-http-proxy');
var app = express()

let {adminhandlers} = require("./import/import_api/adminhandlers.js")

const staticOptions = {enableBrotli: true, orderPreference: ["br", "gzip"]}

app.use("/test", async (req, res)=>{
	const fs = require("fs").promises
	res.status(200).send(JSON.stringify(await fs.readdir("/data")))
})
app.use("/mkdir", async (req, res)=>{
	const fs = require("fs").promises
	await fs.mkdir("/data/2012")
	await fs.writeFile("/data/2021/time.txt", ""+Date.now(), "utf-8")
	res.status(200).send(JSON.stringify(await fs.readdir("/data")))
})
app.use("/admin", adminhandlers)
app.use("/stplversions/1920/", expressStaticGzip("./import/1920/stpl_extractedVersions", staticOptions))
app.use("/import", expressStaticGzip("./import/import_api", staticOptions))
app.use("/data", expressStaticGzip("./root_data", staticOptions))
app.use("/config", expressStaticGzip("./config", staticOptions))
app.use("/cacheSettingsTest", expressStaticGzip("./cacheSettingsTest", staticOptions))
//app.use("/", expressStaticGzip("./", staticOptions));

//app.use("/admin", proxy('http://localhost:12222'))

const PORT = 11300
app.listen(PORT)
console.log(`KB server running on ${11300}`)

