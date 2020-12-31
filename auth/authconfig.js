const os = require("os")

const authconfig = {
	MYURL: os.platform().includes("win") ? "http://localhost:11300/auth" : "https://gymburgdorf1.hidora.com/auth",
	//https://hello.gymburgdorf.ch, https://auth.gymburgdorf.ch
	entrypath: "/authtest",
	loginpath: "/logintest",
	callbackpath: "/redirecttest", //adapt on console.developers.google.com > adrian.luethi@gymburgdorf.ch > auth2
}

module.exports = authconfig