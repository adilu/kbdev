const crypto = require("crypto")
const b62 = require("./base62")
const {loadSecret} = require("../../isomorphic/loadSecret")

function hash(data) {
	return crypto.createHash("sha256").update(data+"salzindersuppe").digest("base64").slice(0,42)
}

function encode(user, now = b62.dateToB62()) {
	return [now, encrypt(user), hash(user+now)].join("*")
}

function encrypt(text){
	let iv = crypto.randomBytes(16)
	let cipher = crypto.createCipheriv("aes-256-cbc", loadSecret("legacy_uid_key"), iv)
	return cipher.update(text,"utf8","hex") + cipher.final("hex") + "_" + iv.toString("hex")
}

function decrypt(text){
	let [payload, iv] = text.split("_")
	let decipher = crypto.createDecipheriv("aes-256-cbc", loadSecret("legacy_uid_key"), Buffer.from(iv, "hex"))
	return decipher.update(payload,"hex","utf8") + decipher.final("utf8")
}

function decodeUid(uid) {
	let [b62date, encrypteduser, hashed] = uid.split("*")
	let user = decrypt(encrypteduser)
	return {date: b62.b62ToDate(b62date), user, valid: hash(user+b62date) === hashed}
}

function getUserFromUid(uid) {
	let {date, user, valid} = decodeUid(uid)
	return valid && user
}

function createEcryptorDecryptorPair(pw, ivfix="") {
	return {
		encrypt: function(text, ){
			let iv = ivfix ? Buffer.from(ivfix, "hex") : crypto.randomBytes(16)
			let cipher = crypto.createCipheriv("aes-256-cbc", pw, iv)
			return cipher.update(text,"utf8","hex") + cipher.final("hex") + "_" + iv.toString("hex")
		},
		decrypt: function decrypt(text){
			let [payload, iv] = text.split("_")
			let decipher = crypto.createDecipheriv("aes-256-cbc",pw, Buffer.from(iv, "hex"))
			return decipher.update(payload,"hex","utf8") + decipher.final("utf8")
		}
	}
}

module.exports = {encode, getUserFromUid, decodeUid, createEcryptorDecryptorPair}