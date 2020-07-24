const fs = require("fs").promises
const {fork, spawn} = require("child_process")
const path = require("path")
const {loadExtractedLists, loadEventoMerged, loadStplHistory} = require("../importhelpers/loadData")

// process.chdir( __dirname )

const SJ = "2021"

let tasks = {
	getStplVersions,
	getEventoVersions,
	getExtractedLists,
	getEventoMerged,
	getStplHistory,
	importAll,
	importNext,
}

async function adminhandlers(req, res) {
	for(let task in tasks) {
		if(req.url.startsWith("/"+task)) return tasks[task](req, res)
	}
	return await showMainPage(req, res)
	// 	if(fs.existsSync("."+req.url) && req.url.endsWith(".js")) {
	// 		return serveScript(req, res)
	// 	}
	// 	showMainPage(req, res)
	// }).listen(12222)

	// console.log("Server running on 12222")



	// console.log(req.path)
	// //res.status(200).send(__dirname)
	// const importStarterOfYear = path.join(__dirname, "../__test_fork.js")
	// res.writeHead(200, {"Content-Type": "text/html"})
	// const importer = fork(importStarterOfYear, [], { silent: true })
	// res.write("Importing...\n")
	// importer.stdout.on("data", (data) => res.write(data.toString()) )
	// importer.stderr.on("data", (data) => res.write(data.toString()) )
	// importer.on("exit", (code) => {
	// 	res.write(code == 0 ? "Finished sucessfully.": `Finished with code ${code}`)
	// 	res.end()
	// })
}

async function getStplVersions(req, res) {
	let versions = await fs.readdir(path.join(__dirname, `../${SJ}/stpl_extractedVersions`))
	res.json(versions.filter(v=>v.endsWith(".txt")))
}

async function getEventoVersions(req, res) {
	let versions = await fs.readdir(path.join(__dirname, `../${SJ}/evento_extractedVersions`))
	res.json(versions.filter(v=>v.endsWith(".json")))
}

async function getExtractedLists(req, res) {
	res.json(await loadExtractedLists(SJ))
}

async function getEventoMerged(req, res) {
	res.json(await loadEventoMerged(SJ))
}

async function getStplHistory(req, res) {
	res.json(await loadStplHistory(SJ))
}

async function showMainPage(req, res) {
	res.writeHead(200, {"Location": "/"})
	res.write(await fs.readFile(path.join(__dirname, "./index.html"), "utf8"))
	res.end()
}

function getYear() {
	let d = new Date()
	let y = d.getFullYear() % 2000
	let m = d.getMonth() + 1
	let currentyear = m <= 7 ? "" + (y-1) + y : "" + y + (y+1)
	let nextyear = "" + y + (y+1)
	return {currentyear, nextyear}
}

function importAll(req, res, next = false) {
	let SJ = next ? getYear().nextyear : getYear().currentyear
	res.writeHead(200, {"Content-Type": "text/html"})
	const importer = fork("./import/0_run.js", [SJ], { silent: true })
	res.write("Importing...\n")
	importer.stdout.on("data", (data) => res.write(data.toString()) )
	importer.stderr.on("data", (data) => res.write(data.toString()) )
	importer.on("exit", (code) => {
		res.write(+code === 0 ? "Finished.": `Finished with code ${code}`)
		res.end()
	})
}

function importNext(req, res) {
	importAll(req, res, true)
}

module.exports = {adminhandlers}



// const tasks = {
// 	entry,
// 	login,
// 	eventoUpdates,
// 	stplUpdates,
// 	importAll,
// 	importNext,
// 	moveDevToProd,
// 	kill,
// 	//log,
// 	stat,
// 	datatest
// }

// const COOKIE = fs.readFileSync("./sec/admincookie.txt", "utf8") + "_09mc58"
// const ZOUBERSPRUCH = fs.readFileSync("./sec/adminzouberspruch.txt", "utf8")

// http.createServer(function (req, res) {
	
// 	for(let task in tasks) {
// 		if(req.url.startsWith("/"+task)) return tasks[task](req, res)
// 	}
// 	if(!req.headers.cookie || !req.headers.cookie.includes(COOKIE)) {
// 		return requireLogin(req, res)
// 	}
// 	if(fs.existsSync("."+req.url) && req.url.endsWith(".js")) {
// 		return serveScript(req, res)
// 	}
// 	showMainPage(req, res)
// }).listen(12222)

// console.log("Server running on 12222")


// function showMainPage(req, res) {
// 	res.writeHead(200, {"Location": "/"})
// 	res.write(fs.readFileSync("./x_admin.html", "utf8"))
// 	res.end()
// }

// function serveScript(req, res) {
// 	res.writeHead(200, {"Location": "/", "Content-Type": "text/javascript"})
// 	res.write(fs.readFileSync("."+req.url, "utf8"))
// 	return res.end()
// }


// function datatest(req, res) {
// 	res.writeHead(200, {"Location": "/"})
// 	res.write(fs.readFileSync("./datatest.html", "utf8"))
// 	res.end()
// }

// function requireLogin(req, res) {
// 	res.writeHead(302, {"Location": "/entry"})
// 	res.end()
// }

// function loginOk(req, res) {
// 	res.writeHead(302, {"Location": "/", "Set-Cookie": "auth=" + COOKIE + "; expires=" + new Date(Date.now()+6000e3).toUTCString()})
// 	res.end()
// }

// function entry(req, res) {
// 	res.writeHead(401, {"Content-Type": "text/html"})
// 	res.write("<html><body><form method='GET' action='/login'><input name='p11' type='password' placeholder='Passwort'><button type='submit'>Log in</button></form></body></html>")
// 	res.end()
// }

// function login(req, res) {
// 	req.url.includes(ZOUBERSPRUCH) ? loginOk(req, res) : requireLogin(req, res)
// }


// function eventoUpdates(req, res) {
// 	const prefix = "evento_result_"
// 	let updates = fs.readdirSync(`./${getYear().currentyear}/evento_extractedVersions`).filter(f=>f.startsWith(prefix)).map(f=>f.split(".")[0].slice(prefix.length))
// 	respondWithJson(res, updates)
// }

// function stplUpdates(req, res) {
// 	const prefix = "extracted_"
// 	let updates = fs.readdirSync(`./${getYear().currentyear}/stpl_extractedVersions`).filter(f=>f.startsWith(prefix)).map(f=>f.split(".")[0].slice(prefix.length))
// 	respondWithJson(res, updates)
// }

// function respondWithJson(res, data) {
// 	res.writeHead(200, {"Content-Type": "application/json"})
// 	res.write(JSON.stringify(data))
// 	res.end()
// }

// function stat(req, res) {
// 	res.writeHead(200, {"Content-Type": "text/html"})
// 	res.write("STAT")
// 	res.end()
// }




// async function moveDevToProd(req, res) {
// 	const {moveDevToProduction} = require("./transferFiles")
// 	res.writeHead(200, {"Content-Type": "text/html"})
// 	try {
// 		await moveDevToProduction(getYear().currentyear, "../")
// 		res.write("OK, files were moved. May be check for changes first.")
// 		res.end()
// 	} catch(e) {
// 		res.write(`Problem copying files!! ${e}`)
// 		res.end()
// 	}
// }

// async function kill(req, res) {
// 	if(!req.headers.cookie || !req.headers.cookie.includes(COOKIE)) {
// 		return requireLogin(req, res)
// 	}
// 	res.writeHead(200, {"Content-Type": "text/html"})
// 	res.write("OK, let's try to shut down.")
// 	res.end()
// 	setTimeout(_=>process.exit(), 2000)
// }

// // function parseCookies (request) {
// // 	var list = {},
// // 			rc = request.headers.cookie;

// // 	rc && rc.split(';').forEach(function( cookie ) {
// // 			var parts = cookie.split('=');
// // 			list[parts.shift().trim()] = decodeURI(parts.join('='));
// // 	});

// // 	return list;
// // }