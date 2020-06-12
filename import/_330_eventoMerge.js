const PATHS = require("./paths")
const path = require("path")
const {readFile, readdir} = require("fs").promises
const {overwriteIfChanged} = require("./importhelpers/overwriteIfChanged")
const {loadExtractedLists} = require("./importhelpers/loadData")

async function eventoMerge(SJ) {
	const {semOfJSW} = require(PATHS.getDatehelpers(SJ))
	let lists = await loadExtractedLists(SJ)
	let timestamps = extractTimestamps(lists)
	let validFrom = getValidFrom(timestamps, SJ)
	let neccessary = validFrom.map((x,i,a)=>i===a.length-1 || a[i+1] > x ? x : false)
	let merged = {}
	let logFile = []
	for(let key of getKeys(lists)) {
		console.log(key)
		for(let i = 0; i < timestamps.length; i++) {
			if(neccessary[i] === false) {
				continue
			}
			let timestamp = timestamps[i]
			let validStart = validFrom[i]
			let list = lists[`${key}_${timestamp}`]
			if(!merged[key]) {
				merged[key] = list
				continue
			}
			let {added, removed, changed, readded} = diffLists(merged[key], list, key)

			changed.forEach(({now, existing}) => {
				Object.keys(now).filter(k=>existing[k] !== now[k]).forEach(k=>{
					logFile.push({key, timestamp, action: "change", value: JSON.stringify(now), changed: k, from: existing[k], to: now[k]})
				})
			})
			added.forEach(entry=>{
				merged[key].push(entry)
				if(key==="susToCourse" && semOfJSW(validStart) === 1) {
					let cid = entry[1]
					if(merged.courselist.find(c=>c.cid===cid).semester===2) return
				}
				if(validStart > 0) addAfter(entry, validStart)
				logFile.push({key, timestamp, action: "add", value: JSON.stringify(entry)})
			})
			readded.forEach(entry=>{
				addAfter(entry, validStart)
				logFile.push({key, timestamp, action: "readd", value: JSON.stringify(entry)})
			})
			removed.forEach(entry=>{
				if(entry.semester===1 && list.filter(x=>x.semester===1).length / list.filter(x=>x.semester===2).length < 0.2) {
					return
				}
				if(key==="susToCourse" && semOfJSW(validStart) === 2) {
					let cid = entry[1]
					if(merged.courselist.find(c=>c.cid===cid).semester===1) return
				}
				if(currentlyValid(entry)) {
					removeAfter(entry, validStart)
					logFile.push({key, timestamp, action: "invalidate", value: JSON.stringify(entry)})
				}
			})
		}
		if(key==="susToCourse") {
			const {adaptEventoSusToCourse} = require(path.join(__dirname, "../config", SJ, "temporaryImportRules.js"))
			adaptEventoSusToCourse.forEach(rule=>merged.susToCourse = rule.check(merged.susToCourse))
			adaptEventoSusToCourse.forEach(rule=>rule.log())
			merged.susToCourse.sort((a,b)=>a[0]-b[0])
		}
		await overwriteIfChanged(path.join(PATHS.getEventoMergedData(SJ), `${key}.json`), JSON.stringify(merged[key]))
	}
	await overwriteIfChanged(path.join(PATHS.getEventoMergedData(SJ), "logFile.json"), JSON.stringify(logFile))
}

function diffLists(merged, current, key) {
	let oldPrimaries = merged.map(extractPrimary)
	let currentPrimaries = current.map(extractPrimary)
	let oldIndex = {}; oldPrimaries.forEach((v,i)=>oldIndex[v] = i)
	let currentIndex = {}; currentPrimaries.forEach((v,i)=>currentIndex[v] = i)
	let oldState = merged.map(extractState)
	let currentState = current.map(extractState)
	let added = current.filter(entry=>oldIndex[extractPrimary(entry)] === undefined)
	let readded = merged.filter(entry=>!currentlyValid(entry)).filter(entry=>{
		return currentIndex[extractPrimary(entry)] >= 0 && entry
	})
	let removed = merged.filter(entry=>currentIndex[extractPrimary(entry)] === undefined)
	let changed = Array.isArray(current[0]) ? [] : current.map(entry=>{
		let hasIdenticalEntry = oldState.indexOf(extractState(entry)) >= 0
		if(!hasIdenticalEntry) {
			let index = oldPrimaries.indexOf(extractPrimary(entry))
			return index > -1 && {now: entry, existing: merged[index]}
		}
		return false
	}).filter(x=>!!x)
	return {added, removed, changed, readded}
}

function currentlyValid(object) {
	let validPeriod = getValidArray(object)
	return validPeriod.length === 0 || validPeriod[validPeriod.length - 1] > 0
}

function getValidArray(object) {
	return Array.isArray(object) ? object[2] || [] : object.validPeriod || []
}

function updateValidArray(object, value) {
	//if(value < 0) console.log({object, v: getValidArray(object)})
	Array.isArray(object) 
		? object[2] = (object[2] || []).concat(value)
		: object.validPeriod = (object.validPeriod || []).concat(value)
}

function removeAfter(object, jsw) {
	console.assert(currentlyValid(object))
	updateValidArray(object, -jsw)
}

function addAfter(object, jsw) {
	console.assert(getValidArray(object).length === 0 || !currentlyValid(object), `addAfter ${jsw} ${JSON.stringify(object)}`)
	if(getValidArray(object).length === 0) {
		updateValidArray(object, -0.1)
	}
	updateValidArray(object, jsw)
}

function extractPrimary(entry, key) {
	return Array.isArray(entry) ? JSON.stringify(entry.slice(0,2)) : (entry.cid || entry.sus)   
}

function extractState(entry) {
	return Array.isArray(entry)
		? JSON.stringify(entry.slice(0,2))
		: JSON.stringify(Object.keys(entry).filter(k=>k!=="validPeriod"&&k!=="alias").reduce((o,n)=>{o[n]=entry[n]; return o}, {})) 
}

function getKeys(lists) {
	return [...new Set(Object.keys(lists).map(v=>v.split("_")[0]))]
}

function getValidFrom(timestamps, SJ) {
	const {getWeek, getWeekYear, weekArray} = require(PATHS.getDatehelpers(SJ))
	return timestamps.map((timestamp, index)=>{
		//Änderungen ab Freitag gelten ab nächster Woche
		const validStart = new Date(+timestamp + 3*86400000)
		let validJSW = weekArray.findIndex(w => (+w.year === +getWeekYear(validStart) && w.week >= getWeek(validStart)) || w.year > getWeekYear(validStart))
		return index===0 ? 0 : validJSW
	})
}

//also in index
function extractTimestamps(lists) {
	return [...new Set(Object.keys(lists).map(v=>+v.split("_")[1]))]
}



module.exports = {eventoMerge}