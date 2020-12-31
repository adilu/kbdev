const fs = require("fs")
const path = require("path")
const PATHS = require("./import/paths")
const {notifyAdmin} = require("./mail/sendmail")

// process.chdir( __dirname )

const SJ = "2021"

let tasks = {
	testWrite,
	testRead,
	readMod10
}

async function dbhandlers(req, res) {
	for(let task in tasks) {
		if(req.url.startsWith("/"+task)) return tasks[task](req, res)
	}
	return res.status(404).send("Task not found")
}

async function testWrite(req, res) {
	let p = path.join(PATHS.getDataPathOfYear(SJ), "db_test")
	if(!fs.existsSync(p)) fs.mkdirSync(p)
	for(let i = 0; i < 20000; i++) {
		await fs.promises.writeFile(path.join(p, "entry_" + i), ""+Date.now())
	}
	res.send({ok: true})
}

async function testRead(req, res) {
	let p = path.join(PATHS.getDataPathOfYear(SJ), "db_test")
	let files = await fs.promises.readdir(p)
	notifyAdmin("<h1>Hooray, Adi, that works</h1>", "yes, its here!")
	res.send({data: files})
}

async function readMod10(req, res) {
	let p = path.join(PATHS.getDataPathOfYear(SJ), "db_test")
	let files = await fs.promises.readdir(p)
	let x = {}
	for(const f of files) {
		let num = +f.slice(6)
		if(num % 10 === 0) {
			x["data_" + num] = await fs.promises.readFile(path.join(p, f), "UTF-8")
		}
	}
	res.send(x)
}

module.exports = {dbhandlers}

