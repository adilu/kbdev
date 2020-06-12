const ftp = require("basic-ftp")
const {loadSecret} = require("./loadSecret.js")

async function ftpsClient(remotepath, isTest = false) {
	const client = new ftp.Client()
	client.ftp.verbose = false
	try {
		await client.access({
			host: "diskstation.gymburgdorf.ch",
			user: loadSecret("ftp_stpl_user"),
			password: loadSecret("ftp_stpl_pw"),
			secure: true
		})
		await client.cd(remotepath)
		return client
	}
	catch(err) {
		console.warn(err)
	}
}

module.exports = {ftpsClient}