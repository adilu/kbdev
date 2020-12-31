const crypto = require("crypto")
const {loadSecret} = require("../isomorphic/loadSecret")
// function hash(data) {
//   return crypto.createHash("sha256").update(data+"salzindersuppe").digest("base64").slice(0,42);
// }

const encode_decode_key = loadSecret("kb_encode")

function encode(user) {
	let payload = {user, iat: Date.now()}
	return encrypt(JSON.stringify(payload))
}

function encrypt(text){
	let iv = crypto.randomBytes(16)
	let cipher = crypto.createCipheriv("aes-256-cbc", encode_decode_key, iv)
	return cipher.update(text,"utf8","hex") + cipher.final("hex") + "_" + iv.toString("hex")
}

function decrypt(text){
	let [payload, iv] = text.split("_")
	let decipher = crypto.createDecipheriv("aes-256-cbc", encode_decode_key, Buffer.from(iv, "hex"))
	return decipher.update(payload,"hex","utf8") + decipher.final("utf8")
}

function decode(text){
	return JSON.parse(decrypt(text))
}

//
// function decodeUid(uid) {
//   let [b62date, encrypteduser, hashed] = uid.split("*");
//   let user = decrypt(encrypteduser);
//   return {date: b62.b62ToDate(b62date), user, valid: hash(user+b62date) === hashed};
// }
//
// function getUserFromUid(uid) {
//   let {date, user, valid} = decodeUid(uid);
//   return valid && user;
// }

module.exports = {encode, decode}