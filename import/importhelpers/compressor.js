const {gzip, createBrotliCompress} = require("zlib")
const zlib = require("zlib")
const fs = require("fs")
const fsProm = require("fs").promises

async function createGzip(path) {
	let stat = await fsProm.stat(path)
	let str = await fsProm.readFile(path)
	return new Promise((resolve, reject) => {
		let buf = Buffer.from(str)
		gzip(buf, async function (err, result) {
			if(err) {reject(err); return}
			await fsProm.writeFile(path + ".gz", result)
			await fsProm.utimes(path + ".gz", stat.atime, stat.mtime)
			resolve()
		})
	})
}

async function createBrotli(path) {
	let stat = await fsProm.stat(path)
	const readStream = fs.createReadStream(path)
	const writeStream = fs.createWriteStream(path + ".br")
	// Create brotli compress object
	const brotli = zlib.createBrotliCompress()
	// Pipe the read and write operations with brotli compression
	const stream = readStream.pipe(brotli).pipe(writeStream)
	await new Promise((resolve, reject)=>{
		stream.on("finish", resolve)
	})
	await fsProm.utimes(path + ".br", stat.atime, stat.mtime)
}

async function compress(path) {
	await createGzip(path)
	await createBrotli(path)
}

async function compressDir(path) {
	let entries = await fsProm.readdir(path, {withFileTypes: true})
	let files = entries.filter(dirent=>dirent.isFile() && !["gz", "br"].some(ext=>dirent.name.endsWith(ext)))
	for(let f of files) {
		let p = path + "/" + f.name
		let stat = await fsProm.stat(p)
		let statGz = fs.existsSync(p + ".gz") && await fsProm.stat(p + ".gz")
		let statBr = fs.existsSync(p + ".br") && await fsProm.stat(p + ".br")
		if(+stat.mtime !== +statGz.mtime || +stat.mtime !== +statBr.mtime) {
			await compress(p)
		}
	}
}

module.exports = {createGzip, createBrotli, compress, compressDir}