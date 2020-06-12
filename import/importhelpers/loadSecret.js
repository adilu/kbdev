const fs = require("fs")
const path = require("path")
const DEV = process.platform.startsWith("win")

function loadSecret(name, extension=".txt") {
	if(DEV) {
		return fs.readFileSync(path.join(__dirname, "../../sec", name + extension), {encoding: "UTF-8"})
	}
	else {
		return process.env[name]
	}
}

module.exports = {loadSecret}