const http = require("http"),
	//url = require('url'),
	path = require("path"),
	fs = require("fs")
const url = require("url")
// b62 = require("../metamodules/base62"),
const {encode} = require("./kb_encode")
const {loadSecret} = require("../isomorphic/loadSecret")
// const {parseTextBody, parseJsonBody} = require("../my_modules/3e8-body-parsers");
// const {respondWithText, respondWithJson} = require("../my_modules/3e8-respond");
// const staticPipe = require("../my_modules/3e8-static-pipe");
//const {log, logError, warn, logger} = require("../my_modules/3e8-log")
//const {writeFile, readFile, readDir} = require("prms-fs");

const CLIENTID = loadSecret("gapi_client")
const CLIENTKEY = loadSecret("gapi_key")

const {MYURL} = require("./authconfig.js")

const {google} = require("googleapis")

// const oauth2Client = new google.auth.OAuth2(
// 	CLIENTID,
// 	CLIENTKEY,
// 	MYURL + "/klassenbuch"
// )

const oauth2Client = new google.auth.OAuth2(
	CLIENTID,
	CLIENTKEY,
	MYURL + "/redirecttest"
)

let token

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile"
]

const defaultUrl = oauth2Client.generateAuthUrl({
	access_type: "offline", // 'online' (default) or 'offline' (gets refresh_token)
	scope: scopes,
	hd: "gymburgdorf.ch",
	redirect_uri: MYURL + "/klassenbuch"
})

function createAuthUrl({to}) {
	return oauth2Client.generateAuthUrl({
		access_type: "offline", // 'online' (default) or 'offline' (gets refresh_token)
		scope: scopes,
		hd: "gymburgdorf.ch",
		redirect_uri: MYURL + "/klassenbuch",
		state: to
	})
}

function createAuthUrlTest({to}) {
	return oauth2Client.generateAuthUrl({
		access_type: "offline", // 'online' (default) or 'offline' (gets refresh_token)
		scope: scopes,
		hd: "gymburgdorf.ch",
		redirect_uri: MYURL + "/redirecttest",
		state: to
	})
}

async function auth2_handlers(req, res) {
	let urlObj = new URL(req.url, MYURL)
	console.log(req.url)
	// v3
	if(req.url.startsWith("/authtest")) {
		return res.sendFile("./authtest_kbdev.html", {root: __dirname})
	}
	else if(req.url.startsWith("/logintest")) {
		console.log("logintest")
		let to = encodeURI(urlObj.searchParams.get("to") || MYURL)
		if(to.endsWith("/")) {to = to.slice(0,-1)}
		console.log({to})
		let authUrl = createAuthUrlTest({to})
		res.writeHead(302, {"Location": authUrl})
		return res.end()
	}
	else if(req.url.startsWith("/redirecttest")) {
		let code
		let tokens = null
		try {
			let to = urlObj.searchParams.get("state") || MYURL + "/defaulttest"
			code = urlObj.searchParams.get("code")
			// let m = req.url.match(/\?(?:.*?&)?code=([^&]*)/)
			// let code = m && m[1];
			console.log({code})
			if(!code) {
				//warn(`no auth code, ${req.method} ${req.url}`)
				res.writeHead(302, {"Location": `${to}/entry.html`})
				res.end()
				return
			}
			//let start = Date.now();
			// const {tokens} = await Promise.race([
			//   oauth2Client.getToken(decodeURIComponent(code)).then(tokenObj=>{
			//     log(`GoogleApis success (${code.slice(0,6)}-${code.length}, ${Date.now()-start}, ${tokenObj && Object.keys(tokenObj)})`);
			//     return tokenObj;
			//   }),
			//   new Promise(resolve => setTimeout(_=>resolve({tokens: null}), 5000))
			// ]);
			let tokens = await getTokens(code)
			console.log({tokens})
			if(tokens === null) {
				tokens = await getTokens(code)
				//log(tokens ? "tokens retry successful" : "tokens retry failed")
			}
			if(tokens === null) {
				//warn(`GoogleApis failure (${code.slice(0,6)}-${code.length}, to: ${to}, isSame: ${code === req.url.match(/\\?(?:.*?&)?code=([^&]*)/)[1]})`)
				res.writeHead(301, {"Location": `${to}/entry.html?connection_reset`})
				res.end()
				return
			}
			successfulLogins++
			//log(`GoogleApis success (${code.slice(0,6)}-${code.length})`);
			token = tokens.access_token
			oauth2Client.setCredentials(tokens)
			//console.log(oauth2Client);
			let d = await new Promise((resolve, reject)=>{oauth2Client.verifyIdToken(
				{idToken: oauth2Client.credentials.id_token,
					audience: CLIENTID, //or client_id array of client_ids
				},
				function(e, login) {
					if (e) return reject(e)
					let payload = login.getPayload()
					let {sub: id, email, name, hd: domain, picture} = payload
					let user = email.replace("@gymburgdorf.ch", "").toLowerCase()
					resolve({id, email, picture, domain, user})
				}
			)})

			if(!d.email.endsWith("@gymburgdorf.ch")) {
				res.writeHead(301, {"Location": `${to}/entry.html?use_gymburgdorf`})
				res.end()
				//warn("useGymburgdorf: " + d.email)
				return
			}
			console.log({to, d})
			res.writeHead(301, {"Location": `${to}?jwts=${encode(d.user)}`})
			res.end()
		}
		catch(e) {
			if(e.message === "invalid_grant") {
				//warn(`invalid_grant ${code} ${tokens}`)
			}
			else console.warn(e)
		}
	}
	else if(req.url.startsWith("/defaulttest")) {
		return res.sendFile("./authtest_kbdev.html", {root: __dirname})
	}
	// else if(req.url.startsWith("/kbdev")) {
	// 	console.log("kbdev")
	// 	let to = encodeURI(urlObj.searchParams.get("to") || "http://localhost:5000")
	// 	if(to.endsWith("/")) {to = to.slice(0,-1)}
	// 	let authUrl = createAuthUrl({to})
	// 	res.writeHead(302, {"Location": authUrl})
	// 	res.end()
	// }
	// else if(req.url.startsWith("/gymburg_login")) {
	// 	console.log("gb_login")
	// 	let to = encodeURI(urlObj.searchParams.get("to") || "https://klassenbuch.gymburgdorf.ch")
	// 	if(to.endsWith("/")) {to = to.slice(0,-1)}
	// 	let authUrl = createAuthUrl({to})
	// 	res.writeHead(302, {"Location": authUrl})
	// 	res.end()
	// }
	// else if(req.url.startsWith("/klassenbuch")) {
	// 	let code
	// 	let tokens = null
	// 	try {
	// 		let to = urlObj.searchParams.get("state") || "https://klassenbuch.gymburgdorf.ch"
	// 		code = urlObj.searchParams.get("code")
	// 		// let m = req.url.match(/\?(?:.*?&)?code=([^&]*)/)
	// 		// let code = m && m[1];
	// 		if(!code) {
	// 			//warn(`no auth code, ${req.method} ${req.url}`)
	// 			res.writeHead(302, {"Location": `${to}/entry.html`})
	// 			res.end()
	// 			return
	// 		}
	// 		//let start = Date.now();
	// 		// const {tokens} = await Promise.race([
	// 		//   oauth2Client.getToken(decodeURIComponent(code)).then(tokenObj=>{
	// 		//     log(`GoogleApis success (${code.slice(0,6)}-${code.length}, ${Date.now()-start}, ${tokenObj && Object.keys(tokenObj)})`);
	// 		//     return tokenObj;
	// 		//   }),
	// 		//   new Promise(resolve => setTimeout(_=>resolve({tokens: null}), 5000))
	// 		// ]);
	// 		let tokens = await getTokens(code)
	// 		if(tokens === null) {
	// 			tokens = await getTokens(code)
	// 			//log(tokens ? "tokens retry successful" : "tokens retry failed")
	// 		}
	// 		if(tokens === null) {
	// 			//warn(`GoogleApis failure (${code.slice(0,6)}-${code.length}, to: ${to}, isSame: ${code === req.url.match(/\\?(?:.*?&)?code=([^&]*)/)[1]})`)
	// 			res.writeHead(301, {"Location": `${to}/entry.html?connection_reset`})
	// 			res.end()
	// 			return
	// 		}
	// 		successfulLogins++
	// 		//log(`GoogleApis success (${code.slice(0,6)}-${code.length})`);
	// 		token = tokens.access_token
	// 		oauth2Client.setCredentials(tokens)
	// 		//console.log(oauth2Client);
	// 		let d = await new Promise((resolve, reject)=>{oauth2Client.verifyIdToken(
	// 			{idToken: oauth2Client.credentials.id_token,
	// 				audience: CLIENTID, //or client_id array of client_ids
	// 			},
	// 			function(e, login) {
	// 				if (e) return reject(e)
	// 				let payload = login.getPayload()
	// 				let {sub: id, email, name, hd: domain, picture} = payload
	// 				let user = email.replace("@gymburgdorf.ch", "").toLowerCase()
	// 				resolve({id, email, picture, domain, user})
	// 			}
	// 		)})
	//
	// 		if(!d.email.endsWith("@gymburgdorf.ch")) {
	// 			res.writeHead(301, {"Location": `${to}/entry.html?use_gymburgdorf`})
	// 			res.end()
	// 			//warn("useGymburgdorf: " + d.email)
	// 			return
	// 		}
	// 		res.writeHead(301, {"Location": `${to}/jwts.php?jwts=${encode(d.user)}`})
	// 		res.end()
	// 	}
	// 	catch(e) {
	// 		if(e.message === "invalid_grant") {
	// 			//warn(`invalid_grant ${code} ${tokens}`)
	// 		}
	// 		//else warn(e)
	// 	}
	// }
	else res.end("not found")
}

async function getTokens(code) {
	const {tokens} = await Promise.race([
		oauth2Client.getToken(decodeURIComponent(code)).then(tokenObj=>{return tokenObj}),
		new Promise(resolve => setTimeout(_=>resolve({tokens: null}), 3000))
	])
	return tokens
}

let successfulLogins = 0
//setInterval(_=>log(`${successfulLogins} successful logins in 24h`), 24*3600*1000)

//log({MYURL, v: 2})

module.exports = {auth2_handlers}
