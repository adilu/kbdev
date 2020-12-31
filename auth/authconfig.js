const os = require("os")

const authconfig = {
	MYURL: os.platform().includes("win") ? "http://localhost:11300/auth" : "https://auth.gymburgdorf.ch",
	//https://hello.gymburgdorf.ch, https://gymburgdorf1.hidora.ch/auth
	entrypath: "/authtest",
	loginpath: "/logintest",
	callbackpath: "/redirecttest", //adapt on console.google.com > adrian.luethi@gymburgdorf.ch > auth2
}

module.exports = authconfig