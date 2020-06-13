const fs = require("fs")
const {loadSecret} = require("./loadSecret.js")
const NOENCRYPT = false
const https = require(NOENCRYPT ? "http" : "https")

async function postToPdfify(path, data) {
	const jsonObject = JSON.stringify(data)
	const postheaders = {
		"Content-Type" : "application/json",
		"Content-Length" : Buffer.byteLength(jsonObject, "utf8")
	}
	const options = {
		host : loadSecret("pdf_url"),
		port : NOENCRYPT ? 80 : 443,
		path : path, //'/pdf',
		method : "POST",
		headers : postheaders
	}
	return new Promise((resolve, reject) => {
		const reqPost = https.request(options, response => resolve(response))
		reqPost.write(jsonObject)
		reqPost.end()
		reqPost.on("error", error => {console.warn(error); reject(error)})
	})
}

async function printPdf(url, saveToPath, iterations = 0) {
	console.log("try to get file " + saveToPath)
	try {
		const data = {
			url: url, //data: '<html><head><style>html {color: red;}</style></head><body><p>Hello, world!</p>'.repeat(3)+'<p style="page-break-after: always">break</p>'+'<p>Hello, world!</p>'.repeat(10)+'</body></html>',
			key: loadSecret("pdf_pw"),
			timeout: 20000,
			waitForSelector: ".ready",
			options: {scale: 1.2, margin: {top: "14mm", left: "18mm", right: "18mm", bottom: "10mm"}}
		}
		const response = await postToPdfify("/html2pdf", data)
		if(response.statusCode === 200) {
			return await new Promise((resolve, reject) => {
				let file = fs.createWriteStream(saveToPath)
				response.pipe(file)
				response.on("end", _=>{
					console.log("File saved!")
					resolve("File saved!")
				})
				file.on("error", e=>{
					console.log(e)
					reject("error")
				})
			})
		}
		else {
			throw new Error("Error in request or timeout " + response.statusCode)
		}
	}
	catch(e) {
		console.warn(e)
		if(iterations < 3) {
			return await printPdf(url, saveToPath, iterations + 1)
		}
		else return Promise.reject(`Error in request ${e}`)
	}

}

// Support Node.js specific `module.exports` (which can be a function)
if (typeof module !== "undefined" && module.exports) {
	exports = module.exports = {printPdf}
}
// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
exports.MyModule = {printPdf}