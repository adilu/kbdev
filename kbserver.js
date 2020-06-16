const express = require("express")
const expressStaticGzip = require("express-static-gzip")
//const proxy = require('express-http-proxy');
const app = express()
const cors = require("cors")

const PATHS = require("./import/paths")

let {adminhandlers} = require("./import/import_api/adminhandlers.js")

const corsOptions = {
	origin: [/localhost/, /gymburgdorf/]
}

const staticOptions = {enableBrotli: true, orderPreference: ["br", "gzip"]}

// app.use("/test", async (req, res)=>{
// 	const fs = require("fs").promises
// 	res.status(200).send(JSON.stringify(await fs.readdir("/data")))
// })
// app.use("/mkdir", async (req, res)=>{
// 	const fs = require("fs").promises
// 	await fs.mkdir("/data/2021")
// 	await fs.writeFile("/data/2021/time.txt", ""+Date.now(), "utf-8")
// 	await fs.writeFile("/data/2021/time.txt", ""+Date.now(), "utf-8")
// 	res.status(200).send(JSON.stringify(await fs.readdir("/data")))
// })
app.use("/admin", adminhandlers)
app.use("/stplversions/1920/", expressStaticGzip("./import/1920/stpl_extractedVersions", staticOptions))
app.use("/import", expressStaticGzip("./import/import_api", staticOptions))
app.use("/data", cors(corsOptions), expressStaticGzip(PATHS.root_data, staticOptions))
app.use("/config", cors(corsOptions), expressStaticGzip("./config", staticOptions))
app.use("/cacheSettingsTest", cors(corsOptions), expressStaticGzip("./cacheSettingsTest", staticOptions))
app.use("/", expressStaticGzip("./build", staticOptions))

//app.use("/", expressStaticGzip("./", staticOptions));

//app.use("/admin", proxy('http://localhost:12222'))

const PORT = 11300
app.listen(PORT)
console.log(`KB server running on ${11300}`)

