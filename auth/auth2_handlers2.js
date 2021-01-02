//const url = require("url")
// b62 = require("../metamodules/base62"),
const {encode, decode} = require("./kb_encode")
const {encode: encodeToUid} = require("./legacy_uid_for_3e8/codecUserV2")
const {loadSecret} = require("../isomorphic/loadSecret")
const {google} = require("googleapis")
const {log, logError, warn} = require("3e8-logremote")
const {MYURL, entrypath, loginpath, callbackpath} = require("./authconfig.js")

const CLIENTID = loadSecret("gapi_client")
const CLIENTKEY = loadSecret("gapi_key")

const oauth2Client = new google.auth.OAuth2(
	CLIENTID,
	CLIENTKEY,
	MYURL + callbackpath
)

function createAuthUrl({to}) {
	const scopeUrl = "https://www.googleapis.com/auth"
	return oauth2Client.generateAuthUrl({
		access_type: "offline", // 'online' (default) or 'offline' (gets refresh_token)
		scope: [`${scopeUrl}/userinfo.email`, `${scopeUrl}/userinfo.profile`],
		hd: "gymburgdorf.ch",
		redirect_uri: MYURL + callbackpath,
		state: to
	})
}

async function auth2_handlers2(req, res, next) {
	let urlObj = new URL(req.url, MYURL)
	// v3
	if(req.url.startsWith(entrypath)) {
		await new Promise((resolve, reject) => {
			res.sendFile("./authtest_kbdev.html", {root: __dirname}, (err) =>{
				err ? reject(err): resolve()
			})
		})
	}
	else if(req.url.startsWith(loginpath)) {
		let to = encodeURI(urlObj.searchParams.get("to") || MYURL)
		if(to.endsWith("/")) {to = to.slice(0,-1)}
		let authUrl = createAuthUrl({to})
		res.writeHead(302, {"Location": authUrl})
		await res.end()
	}
	else if(req.url.startsWith(callbackpath)) {
		let code
		let tokens = null
		try {
			let to = urlObj.searchParams.get("state") || MYURL + entrypath
			code = urlObj.searchParams.get("code")
			if(!code) {
				warn(`no auth code, ${req.method} ${req.url}`)
				res.writeHead(302, {"Location": MYURL + entrypath + `?no_code&to=${to}`})
				res.end()
			}
			let tokens = await getTokens(code)
			if(tokens === null) {
				tokens = await getTokens(code)
				log(tokens ? "tokens retry successful" : "tokens retry failed")
			}
			if(tokens === null) {
				warn(`GoogleApis failure (${code.slice(0,6)}-${code.length}, to: ${to}, isSame: ${code === req.url.match(/\\?(?:.*?&)?code=([^&]*)/)[1]})`)
				res.writeHead(301, {"Location": MYURL + entrypath + `?connection_reset&to=${to}`})
				res.end()
			}
			successfulLogins++
			oauth2Client.setCredentials(tokens)
			let d = await new Promise((resolve, reject)=>{oauth2Client.verifyIdToken(
				{idToken: oauth2Client.credentials.id_token,
					audience: CLIENTID, //or client_id array of client_ids
				},
				function(e, login) {
					if (e) return reject(e)
					let payload = login.getPayload()
					let {sub: id, email, name, hd: domain, picture} = payload
					let user = email.replace("@gymburgdorf.ch", "").toLowerCase().replace(/\./g, "_")
					resolve({id, email, picture, domain, user})
				}
			)})

			if(!d.email.endsWith("@gymburgdorf.ch")) {
				res.writeHead(301, {"Location": MYURL + entrypath + `?use_gymburgdorf&to=${to}`})
				res.end()
				warn("useGymburgdorf: " + d.email)
			}
			else {
				res.writeHead(301, {"Location": `${to}?jwts=${encode(d.user)}`})
				res.end()
			}
		}
		catch(e) {
			if(e.message === "invalid_grant") {
				warn(`invalid_grant ${code} ${tokens}`)
			}
			else warn(e)
		}
	}
	else if(req.url.startsWith("/decode")) {
		let jwts = urlObj.searchParams.get("jwts")
		await res.json(decode(jwts))
	}
	else if(req.url.startsWith("/jwts2uid")) {
		let jwts = urlObj.searchParams.get("jwts")
		let {user} = decode(jwts)
		await res.json({user, uid: encodeToUid(user)})
	}
	else if(req.url.startsWith("/defaulttest")) {
		await res.sendFile("./authtest_kbdev.html", {root: __dirname})
	}
	next()
}

async function getTokens(code) {
	const {tokens} = await Promise.race([
		oauth2Client.getToken(decodeURIComponent(code)).then(tokenObj=>{return tokenObj}),
		new Promise(resolve => setTimeout(_=>resolve({tokens: null}), 3000))
	])
	return tokens
}

let successfulLogins = 0
//let successfulLogins = 0
setInterval(_=>log(`${successfulLogins} successful logins in 24h`), 24*3600*1000)

log({MYURL, v: 4})

module.exports = {auth2_handlers2}
