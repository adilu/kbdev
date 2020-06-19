const PATHS = require("./paths")
const path = require("path")
const {readFile, readdir} = require("fs").promises
const {overwriteIfChanged} = require("./importhelpers/overwriteIfChanged")
const {normalizeHard} = require("./_322_eventoNormalizeHard")
//const {adaptEventoCourse, skipEventoCourse, /*adaptEventoSubj,*/ SJA, SJE} = require(PATHS.importSettings)
const {eventoAdaptions} = require("../config/configPermanent/eventoAdaptions")
//const {adaptEventoCourses} = require(PATHS.temporaryImportRules)

async function handleEventoData(SJ) {
	const PATHTOEXTRACTED = PATHS.getEventoRaw(SJ)
	const {adaptEventoCourses} = require(path.join(PATHS.getConfigOfYear(SJ), "temporaryImportRules.js"))
	const {SJA, SJE} = require(path.join(PATHS.getConfigOfYear(SJ), "config.js"))
	//let results = (JSON.parse(readFileSync(PATHS.eventoResultsJson, "UTF8")))
	// let suslist = []
	// let courselist = []
	// let susToCourse = []
	// let susToClass = []
	// let onleave = normalizedInscriptions.filter(i=>i.isonleave).map(mapToSus).filter(uniqueSus)
	// let noClass = normalizedInscriptions.filter(i=>!i.klasse).map(mapToSus).filter(uniqueSus)
	const lplist = require(PATHS.getLpList(SJ))
	let files = await readdir(PATHTOEXTRACTED)
	let versions = files.filter(f=>f.endsWith(".json")).map(f=>({file: f}))

	for(let v of versions) {
		v.timestamp = + v.file.split(".")[0].split("_")[1]
		console.groupCollapsed(`extracting ${v.timestamp}`)

		let entries = JSON.parse(await readFile(PATHTOEXTRACTED + "/" + v.file, "utf-8"))
		let normalizedInscriptions = entries.map(o=>normalizeHard(o, SJE, lplist)).filter(l=>l!==null)

		eventoAdaptions.forEach(rule=>normalizedInscriptions = rule.check(normalizedInscriptions))
		//console.log(normalizedInscriptions.filter(c=>c.subj==="sR"))
		
		adaptEventoCourses.forEach(rule=>normalizedInscriptions = rule.check(normalizedInscriptions))

		let extracted = extractVersion(normalizedInscriptions) //{onleave, noClass, suslist, courselist, susToClass, susToCourse}
		Object.assign(v, extracted)
		

		for(let list of Object.keys(extracted)) {
			await updateFile(SJ, `${list}_${v.timestamp}`, extracted[list])
		}		
		console.groupEnd()

	}

	//versions.forEach((v, i) => {if(i%5==0) v.suslist = v.suslist.filter(s=>s.sid!=4459)})

	let timestamps = versions.map(v=>v.timestamp)
	let latestVersion = versions[versions.length - 1]
	let {suslist, courselist, susToCourse, susToClass} = latestVersion

	eventoAdaptions.forEach(rule=>rule.log())
	adaptEventoCourses.forEach(rule=>rule.log())

	// let onleave = normalizedInscriptions.filter(i=>i.isonleave).map(mapToSus).filter(uniqueSus)
	// let noClass = normalizedInscriptions.filter(i=>!i.klasse).map(mapToSus).filter(uniqueSus)

	for(let i = versions.length - 2; i >= 0; i--) {
		let v = versions[i]
		for(let sus of v.suslist) {
			
			let existing = suslist.find(s=>s.sid === sus.sid)
			if(!existing) {
				suslist.push(Object.assign(sus, {end: [v.timestamp]}))
			}
			else if(existing.start && (!existing.end || existing.start.length - existing.end.length >= 0)) {
				existing.end = [v.timestamp, ...(existing.end||[])]
			}
		}
		for(let sus of suslist) {
			let wasThere = v.suslist.find(s=>s.sid === sus.sid)
			if(!wasThere && (!sus.start || (sus.end && sus.start.length < sus.end.length))) {
				sus.start = [v.timestamp, ...(sus.start||[])]
			}
		}
	}

	// let haveFilesChanged = [
	// 	await updateFile("courses", courselist),
	// 	await updateFile("sid", suslist),
	// 	await updateFile("matchings", susToCourse)
	// ].some(hasChanged=>hasChanged==true)

	// if(noClass.length) console.warn(`${noClass.length} student(s) without classfield: ${noClass.map(s=>s.email).join(", ")}`)
	// if(onleave.length) console.warn(`${onleave.length} student(s) on leave: ${onleave.map(s=>`${s.firstname} ${s.lastname} ${s.klasse}`).join(", ")}`)

	//return haveFilesChanged
	//console.log(versions.slice(-1)[0])
}

function extractVersion(normalizedInscriptions) {
	let mapToSus = ({sid, email, firstname, lastname, klasse}) => ({sid, email, firstname, lastname, klasse})
	let uniqueSus = (s,i,a) => a.findIndex(t=>t.sid===s.sid) === i
	let onleave = normalizedInscriptions.filter(i=>i.isonleave).map(mapToSus).filter(uniqueSus)
	let noClass = normalizedInscriptions.filter(i=>!i.klasse).map(mapToSus).filter(uniqueSus)

	let suslist = []
	let courselist = []
	let susToCourse = []
	let susToClass = []

	let regularInscriptions = normalizedInscriptions.filter(i=>i.klasse && !i.isonleave)

	for(let i = 0; i < regularInscriptions.length; i++) {

		let r = regularInscriptions[i]

		//Object.assign(r, adaptEventoCourse(r, regularInscriptions))

		//if(skipEventoCourse(r)) continue

		let {cid, subj, lp, klassen, coursetype, semester, sid, email, firstname, lastname, klasse} = r

		if(!suslist.find(s=>s.sid === r.sid)) {
			suslist.push({sid, email, firstname, lastname, klasse})
			susToClass.push([sid, klasse])
		}

		let exists = courselist.find(c=>c.cid === r.cid)
		if(exists && (exists.subj !== subj || exists.lp !== lp || exists.klassen !== klassen)) {console.warn(`Collision of cid!? ${JSON.stringify(exists)} ${cid} ${lp} ${subj} ${klassen}`)}
		exists || courselist.find(c=>c.cid === r.cid) || courselist.push({cid, subj, lp, klassen, coursetype, semester})
		susToCourse.push([sid, cid])
	}

	let sortchain = s => `${s.klasse} ${s.lastname} ${s.firstname} ${s.sid}`.toLocaleLowerCase()
	suslist.sort((a,b)=> sortchain(a).localeCompare(sortchain(b)))

	susToCourse.sort((a,b)=> suslist.findIndex(s=>s.sid===a[0]) - suslist.findIndex(s=>s.sid===b[0]) )

	return {onleave, noClass, suslist, courselist, susToClass, susToCourse}
}

async function updateFile(SJ, name, contentarray) {
	let hasFileChanged = await overwriteIfChanged(path.join(PATHS.getEventoExtracts(SJ), name+".json"), JSON.stringify(contentarray))
	//console.log(`${contentarray.length} ${name} (${hasFileChanged?"has changed":"no changes"})`)
	return hasFileChanged
}

if(require.main === module /*call from commandLine*/ ) {
	handleEventoData()
}

module.exports = {handleEventoData}