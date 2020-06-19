require("tls").DEFAULT_MAX_VERSION = "TLSv1.2"

const https = require("https")
const fs = require("fs")
const {colors} = require("./importhelpers/colors")
const {parseBody, request, logStatusCode} = require("./importhelpers/requesthelpers")
const PATHS = require("./paths")
const {createFolderIfNotExists} = require("./importhelpers/createFolderIfNotExists")
const {readdir, readFile, writeFile} = fs.promises
const {normalizeSoft} = require("./_312_eventoNormalizeSoft")
const {loadSecret} = require("./importhelpers/loadSecret.js")
let where = process.argv[2] && process.argv[2].includes("test") ? "test" : "production"
let isTest = false

const URL = where === "test" ? "evento-test.erz.be.ch" : "evento.erz.be.ch"
const user = where === "test" ? loadSecret("evento_user_test") : loadSecret("evento_user")
const PW = where === "test" ? loadSecret("evento_pw_test") : loadSecret("evento_pw")

const Mandant = "GymBurgdorf"
const clientId= "Burgdorf"
const secret = loadSecret("gymBsecr")
const scope = ""

const CERTKEY = loadSecret("evento-oauth-protected-erz-be-ch", ".key")
const CERT = loadSecret("evento-oauth-protected-erz-be-ch", ".crt")
let clxvalue = ""

const options = {
	hostname: URL,
	path: `/OAuth/Authorization/${Mandant}/Connect?clientId=${clientId}&secret=${secret}`,
	method: "GET",
	key: CERTKEY,
	cert: CERT,
}

if(require.main === module /*call from fommandLine*/ ) {
	fetchEventoApi("2021")
}

async function fetchEventoApi(SJ, onlyTest = false)  {
	isTest = onlyTest
	if(isTest) {console.log = x=>null} //make tests silent}

	console.log("\n", colors.bg.Cyan, colors.fg.Black, `Connecting to Evento API (${where==="test"?"BKT":"Production"}) `, colors.Reset, "\n")
	
	let clientToken = await authClient()
	let clxvalue = await authUser(clientToken)
	
	// Test for addresses
	// let pqmask = JSON.parse(await prepareQuery(clxvalue, "person/FBI-Personen-Alle"));
	// pqmask.SearchFields.find(s=>s.FieldId === "Nachname").SearchText = "Stu";
	// let result = JSON.parse(await executeQuery(clxvalue, pqmask));
	// result.Result.slice(-7).forEach(r=>console.log(colors.fg.White, `${r.Nachname} ${r.Vorname}, ${r.AdresseOrt}`, colors.Reset))

	let pamask = JSON.parse(await prepareQuery(clxvalue, "personenAnmeldung/Export_Klassenbuch"))
	//console.log(pamask);
	pamask.SearchFields.find(s=>s.FieldId === "Status").SearchText = "aA.Angemeldet"
	let result = await executeQuery(clxvalue, pamask)
	//console.log(result);
	let robj = JSON.parse(result)
	robj.Result = robj.Result.filter(entry => !entry["Anlass | AnlassNr"] || !entry["Anlass | AnlassNr"].match(/-MP\d\d-/)) //exclude Matura exam
	robj.Result.sort((a,b) => a.PK2*1e12+a.PK1 - (b.PK2*1e12+b.PK1))
	let normalized = robj.Result.map(o=>normalizeSoft(o))
	const PATHTOEXTRACTED = PATHS.getEventoRaw(SJ)
	createFolderIfNotExists(PATHTOEXTRACTED)
	let resultstring = JSON.stringify(normalized, null, "  ")
	let extracted = await readdir(PATHTOEXTRACTED)
	let newest = extracted.filter(f=>f.endsWith(".json")&&f.startsWith("evento_")).sort().reverse()[0]
	let newestContent = newest ? await readFile(PATHTOEXTRACTED + "/" + newest, "UTF-8") : ""
	const hasChanged = resultstring !== newestContent
	const timestamp = Date.now()
	if(hasChanged && !isTest && resultstring.length > 1000) {
		fs.writeFileSync(PATHS.getEventoRaw(SJ) + `/evento_${timestamp}.json`, resultstring, "UTF8")
	}
	let answer = {hasChanged, resultLength: resultstring.length, prevLength: newestContent.length, timestamp}
	console.log(answer.hasChanged ? "Changes detected!" : "No changes detected.")
	return answer
}

async function authClient() {
	console.log("Connect to GymBurgdorf OAuth Client")
	let data = await request(options)
	let obj = JSON.parse(data)
	let clientToken = obj.access_token
	//console.log(colors.fg.White, `Client_Token: ${clientToken.slice(0,20)}...`, colors.Reset);
	return clientToken
}
async function authUser(clientToken) {
	console.log("\n")
	console.log(`Login User ${user}`)
	const reqoptions = {
		...options,
		path: `/OAuth/Authorization/LoginClient?client_token=${clientToken}&username=${user}&culture_info=de-CH${scope}`,
		method: "POST",
		headers: {
			"Content-Type": "text/plain",
			"cache-control": "no-cache",
		}
	}
	let data = await request(reqoptions, PW)
	try {	
		let obj = JSON.parse(data)
		//accessToken = obj.access_token;
		let clxvalue = `token_type=${obj.token_type}, access_token=${obj.access_token}`
		//console.log(colors.fg.White, clxvalue.slice(0,80) +"...", colors.Reset);
		return clxvalue
	}
	catch(e) {
		console.log(e)
		console.log(data)
		throw new Error("Authorization failed.")
	}

}

async function prepareQuery(clxvalue, target) {
	console.log("\n")
	console.log(`Prepare Query ${target}`)
	const reqoptions = {
		...options,
		path: `/restApi/Search/Definitions/${target}`, //PersonenAnmeldung/Programm_Absenzen_Export, //"FBI-Anmeldungen-Alle", //person/FBI-Personen-Alle",   //PersonenAnmeldung/FBI-Anmeldungen-Alle", //Programm_Absenzen_Export",
		method: "GET",
		headers: {
			"CLX-Authorization": clxvalue
		}
	}
	let data = await request(reqoptions)
	try {
		let searchobj = JSON.parse(data)
		if(!searchobj.SearchFields) {
			throw new Error("No SearchFields found")
		}
		//console.log(colors.fg.White, "Ready to query", colors.Reset);
		//console.log(colors.fg.White, "SearchFields: " + searchobj.SearchFields.map(s=>s.HeaderText).join(", "), colors.Reset);
		return data
	}
	catch(e) {
		console.log(colors.fg.Yellow, data, colors.Reset)
		console.log("\n")
		return data
	}
}

async function executeQuery(clxvalue, query) {
	console.log("\n")
	console.log("Execute Query")
	const reqoptions = {
		...options,
		path: "/restApi/Search/",
		method: "POST",
		headers: {
			"CLX-Authorization": clxvalue,
			"Content-Type": "application/json"
		}
	}
	let data = await request(reqoptions, JSON.stringify(query))
	return data
}

module.exports = {fetchEventoApi}