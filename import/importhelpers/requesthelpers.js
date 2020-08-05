const https = require("https")
const {colors} = require("./colors")

function logStatusCode(response) {
	if(response.statusCode < 400) {
		console.log(colors.fg.Cyan, response.statusCode + " OK", colors.Reset)
	}
	else if(response.statusCode < 500) {
		console.log(colors.fg.Red, response.statusCode + " Unauthorized", colors.Reset)
	}
	else {
		console.log(colors.fg.Red, response.statusCode + " Server Error", colors.Reset)
	}
	//console.log('statusCode:', response.statusCode);
	//console.log('headers:', response.headers);
}

async function request(reqoptions, body = null) {
	return new Promise( (resolve, reject) => {
		const req = https.request(reqoptions, async (response) => {
			logStatusCode(response)
			let data = await parseBody(response)
			resolve(data)
		})
		req.on("error", (error) => {
			console.warn(error)
			reject(error)
		})
		if(body) req.write(body)
		req.end()
	})
}

async function parseBody(response) {
	return new Promise( (resolve, reject) => {
		let data = []
		response.on("data", (d) => data.push(d))
		response.on("end", _ => resolve(Buffer.concat(data).toString()))
	} )
}

module.exports = {parseBody, request, logStatusCode}