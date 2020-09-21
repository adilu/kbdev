const PATHS = require("./paths")
const {readFile, readdir} = require("fs").promises
const {printPdf} = require("./importhelpers/printPdf")
const {overwriteIfChanged} = require("./importhelpers/overwriteIfChanged")
const path = require("path")
const {getDatehelpers} = require("../config/configPermanent/getDatehelpers.js")

// const {stplAdaptions} = require(PATHS.importSettings)
// const {adaptStplCourses} = require(PATHS.temporaryImportRules)

async function extractHistory(SJ) {
	let versions = await loadVersions(SJ)
	for(let i = 0; i < versions.length; i++) {
		let versionset = versions.slice(0, i+1)
		let arrayOfLessons = await extractLessons(versionset, SJ)
		let name = versions[i].match(/extracted_(\d+)\.txt$/)[1]
		await overwriteIfChanged(path.join(PATHS.getStplExtracts(SJ), `stpl_${name}.json`), JSON.stringify(arrayOfLessons))
	}
}

async function stplExtract(SJ) {
	let versions = await loadVersions(SJ)
	let arrayOfLessons = await extractLessons(versions, SJ)
	//let lplist = JSON.parse(await readFile(PATHS.getLpList(SJ), "UTF-8"))
	let hasChanged = await overwriteIfChanged(PATHS.getStplCurrentFile(SJ), JSON.stringify(arrayOfLessons))
	console.log(hasChanged ? "Import finished." : "No changes to import.")
	console.log(`${arrayOfLessons.length} lessons in DB.`)
	if(hasChanged) {
		let name = versions[versions.length-1].match(/extracted_(\d+)\.txt$/)[1]
		await overwriteIfChanged(path.join(PATHS.getStplExtracts(SJ), `stpl_${name}.json`), JSON.stringify(arrayOfLessons))
	}
	return hasChanged
	// if(hasChanged) {
	//   console.log(`Import finshed, ${arrayOfLessons.length} lessons found.`);
	//   try {
	//     await printPdfs(SJ);
	//   }
	//   catch(e) {console.log(`Currently no print (proxy?)`);}
	// }
	// else console.log(`No changes to import. ${arrayOfLessons.length} lessons in DB.`);
}

async function loadVersions(SJ) {
	return (await readdir(PATHS.getStplRaw(SJ))).filter(v=>v.startsWith("extracted")&&v.endsWith(".txt")).sort()
}

async function extractLessons(versions, SJ) {
	let instances = await loadInstances(versions, SJ)
	console.log(instances.length + " instances ready")

	const {adaptStplCourses} = require(path.join(PATHS.getConfigOfYear(SJ), "temporaryImportRules.js"))
	adaptStplCourses.forEach(rule=>{
		instances = rule.check(instances)
		rule.log()
	})
	await new Promise(r=>setTimeout(r, 200))
	let groupedClasses = groupClasses(instances)
	let groupedInstances = groupInstances(groupedClasses)
	let lessons = groupOccurrences(groupedInstances, SJ)
	//hammingCompareForPeriods(Object.values(lessons));
	let arrayOfLessons = Object.values(lessons).map(l=>Object.values(l)) //deflate @check order in kbview.js
	return arrayOfLessons
}

async function loadInstances(versions, SJ) {
	const {getWeek, getWeekYear, weekArray, getJSW} = getDatehelpers(SJ)
	let instances = []
	let validFrom = await Promise.all(versions.map((v,i)=>{
		let created = + v.split(".")[0].split("_")[1]
		//Änderungen ab Freitag gelten ab nächster Woche
		const validStart = new Date(created + 3*86400000)
		let validJSW = weekArray.findIndex(w => (+w.year === +getWeekYear(validStart) && w.week >= getWeek(validStart)) || w.year > getWeekYear(validStart))
		return i===0 ? 0 : validJSW
	}))
	let i = 0
	for(let v of versions) {
		console.log("Processing file: " + v)
		if(versions[i+1] && validFrom[i] === validFrom[i+1]) {i++; continue}
		let t = await readFile(PATHS.getStplRaw(SJ) + "/" + v, "utf8")
		for(const x of t.split("\r\n").filter(x => x!=="")) {
			let [lp,year,month,day,daylesson,subj,klassen,longroom,,,unr,starttime,duration] = x.split(",")  //aj,2015,2,23,2,sB,1c,E11,0,,249,915,45;
			// //@check 3letter lps 2021
			// let mappings = JSON.parse(await readFile(path.join(PATHS.getConfigOfYear(SJ), "mappings.json"), "UTF-8"))
			// if(lp in mappings) {
			// 	lp = mappings[lp]
			// }

			let d = new Date(+year, +month-1, +day, 12, 0, 0)
			if(lp==="??") lp = "" //@CHECK
			let weekday = d.getDay()
			let week = getWeek(d)
			let weekyear = getWeekYear(d)
			let jsw = getJSW(week, weekyear)
			if(jsw === -1) {
				console.log({lp,year,month,day,daylesson,subj,klassen,longroom,unr,starttime,duration})
				console.warn({week, weekyear})
			}
			if(jsw >= validFrom[i] && jsw < (validFrom[i+1] === undefined ? Infinity : validFrom[i+1])) {
				let endtime = +starttime+(+duration)
				if (endtime%100 >= 60 || endtime%100 === 0) {endtime +=40}
				instances.push({unr, lp, weekday, daylesson: +daylesson, subj, klassen, longroom, starttime: +starttime, endtime, jsw})
			}
		}
		i++
	}
	return instances
}

function groupClasses(instances) {
	let groupedClasses = {}
	instances.forEach(i=>{
		let {lp, unr, subj, weekday, daylesson, starttime, endtime, longroom, jsw, klassen} = i
		let uniqueCode = [lp, unr, subj, weekday, daylesson, starttime, endtime, longroom, jsw].join("_")
		groupedClasses[uniqueCode] = groupedClasses[uniqueCode] || i
		if(!groupedClasses[uniqueCode].klassen.includes(klassen)) {
			groupedClasses[uniqueCode].klassen += " "+klassen
		}
	})
	return groupedClasses
}

function groupInstances(groupedClasses) {
	let groupedInstances = {}
	Object.values(groupedClasses).forEach(i=>{
		let {lp, unr, subj, weekday, daylesson, starttime, endtime, longroom, jsw, klassen} = i
		let uniqueCode = [unr, subj, weekday, daylesson, starttime, endtime, longroom, jsw, klassen.replace(/\s/g, "")].join("_")
		groupedInstances[uniqueCode] = groupedInstances[uniqueCode] || i
		groupedInstances[uniqueCode].lp = Array.from(new Set([...groupedInstances[uniqueCode].lp.split("~"), ...lp.split("~")])).join("~")
	})
	return groupedInstances
}

function groupOccurrences(groupedInstances, SJ) {
	const {weekArray, semOfJSW} = getDatehelpers(SJ)
	const lessons = {}
	const emptyOccString = weekArray.map(_=>"0").join("")
	Object.values(groupedInstances).forEach(i=>{
		let {lp, unr, subj, weekday, daylesson, starttime, endtime, longroom, jsw, klassen} = i
		let sem = semOfJSW(jsw) //group By Sem (better for eventoCompare)
		let uniqueCode = [lp.replace(/~/g, ""), unr, subj, weekday, daylesson, starttime, endtime, longroom, klassen.replace(/\s/g, ""), sem].join("_")
		let insertOcc = (oldOccString, i) => oldOccString.slice(0,i) + "1" + oldOccString.slice(i+1)
		if(lessons[uniqueCode]) {
			lessons[uniqueCode].occ = insertOcc(lessons[uniqueCode].occ, jsw)
		}
		else {
			lessons[uniqueCode] = {unr, lp, weekday, daylesson, subj, klassen, longroom, starttime, endtime, occ: insertOcc(emptyOccString, jsw)}
		}
	})
	return lessons
}

async function printPdfs(SJ) {
	const {periods} = getDatehelpers(SJ)
	const URL = `https://klassenbuch.gymburgdorf.ch/stundenplan/${SJ}`
	for(let p of periods) {
		if(p.show) {
			await printPdf(`${URL}?print=lp&period=${p.short}`, path.join(PATHS.getPdfPath(SJ), `Stundenplan_L_${p.short}.pdf`))
			await printPdf(`${URL}?print=klassen&period=${p.short}`, path.join(PATHS.getPdfPath(SJ), `Stundenplan_K_${p.short}.pdf`))
			await printPdf(`${URL}?print=room&period=${p.short}`, path.join(PATHS.getPdfPath(SJ), `Stundenplan_R_${p.short}.pdf`))
		}
	}
}

module.exports = {loadInstances: loadVersions, prepareLessons: extractLessons, stplExtract, extractHistory, printStplPdfs: printPdfs}

// function hammingCompareForPeriods(lessons) {
//   let bin = lessons.map(l=>l.occ.split("").map(x=>+x));
//   console.log(bin);
//   let dist = [];
//   let startend = [];
//   for(let i = 0; i < weekArray.length; i++) {
//     dist[i] = [];
//     startend[i] = [];
//     for(let j = 0; j < weekArray.length; j++) {
//       dist[i][j] = bin.map(b=>b[i]^b[j]).filter(x=>!!x).length;
//       if(j>=i) {
//         startend[i][j] = i===j ? 0 : dist[i].slice(i+1, j).reduce((o,n)=>o+n, 0) / (j-i)**2;
//       }
//     }
//   }
//   console.log(dist);
//   let semMinDuration = 15;
//   let semesterwechsel = startend[0].lastIndexOf(Math.min(...startend[0].slice(semMinDuration), semMinDuration)) + 1;
//   console.log(startend[0], semesterwechsel)
//   let mainMinDuration = 15;
//   let op = startend[semesterwechsel].lastIndexOf(Math.min(...startend[semesterwechsel].slice(semesterwechsel, semesterwechsel+mainMinDuration), semesterwechsel+mainMinDuration)) + 1;
//   console.log(startend[semesterwechsel], op)
//   // let s1 =
//   // let series = startend[0].map((s, start)=>{let score = Math.min(...s.filter((v, end)=>end>start+dmin)); return {start, end: s.indexOf(score, start+dmin), score};});
//   // console.log(series);
// }