const fs = require("fs")
const path = require("path")
const PATHS = require("./import/paths")

// process.chdir( __dirname )

const SJ = "2021"

let tasks = {
	testWrite,
	testRead,
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
	res.send({data: files})
}

module.exports = {dbhandlers}

