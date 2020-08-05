const fs = require("fs")
const path = require("path")
const DEV = process.platform.startsWith("win")

function loadSecret(name, extension=".txt") {
	if(DEV) {
		let secret = fs.readFileSync(path.join(__dirname, "../sec", name + extension), {encoding: "UTF-8"})
		if(name.includes("cert") && name.includes("string") && extension===".txt") {
			secret = secret.replace(/___/g, "\n")
		}
		return secret
	}
	else {
		let secret = process.env[name.replace(/-/g, "_") + (extension !== ".txt" ? "_" + extension.slice(1) : "")]
		return extension !== ".txt" ? secret.replace(/___/g, "\n") : secret
	}
}

module.exports = {loadSecret}