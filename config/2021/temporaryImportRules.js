const PATHS = require("../../import/paths")
const {getDatehelpers} = require("../configPermanent/getDatehelpers.js")
const {semOfJSW, SJE} = getDatehelpers(__dirname.slice(-4))
const {Rule} = require("../../import/Rule.js")
const verbose = process.platform.startsWith("win")

const adaptEventoCourses = [
	//addPartnerCourse({semester: 1, original: {subj: "sR", lp: "kr"}, classIncludes:"20", partner: {lp: "cf"}}),
	// addPartnerCourse({semester: 2, original: {subj: "sW"}, classIncludes:"22a", partner: {subj: "sR", lp: "cf"}}),
	// addPartnerCourse({semester: 2, original: {subj: "sW"}, classIncludes:"22b", partner: {subj: "sR", lp: "cf"}}),
	// addPartnerCourse({semester: 2, original: {subj: "sW"}, classIncludes:"22b", partner: {subj: "WR", lp: "kr"}, cidDelta: 9998}),
	// adaptLP({semester: 1, original: {lp: "bl", subj: "M"}, classIncludes: "23f", newLp: "sb"}),
	// adaptLP({semester: 1, original: {lp: "bl", subj: "M"}, classIncludes: "21e", newLp: "ot"}),
	// adaptLP({semester: 1, original: {lp: "bl", subj: "M"}, classIncludes: "21f", newLp: "gl"}),
	// adaptLP({semester: 2, original: {lp: "lm", subj: "B"}, classIncludes: "23a", newLp: "hr"}),
	adaptLP({original: {subj: "KS"}, classIncludes:"21f", newLp: "we~js"}),
	adaptLP({original: {subj: "KS"}, classIncludes:"21d", newLp: "bi~em"}),
	adaptLP({original: {subj: "KS"}, classIncludes:"21a", newLp: "ha~mj"}),
	//new Rule({name: "sS remove group", remove: true, matchByObj: {lp: "", subj: "sS"}, replaceByObj: {lp: "kn", cid: 15349, klassen: "23d 23f"}}),
]

const adaptStplCourses = [
	adaptLP({original: {subj: "fH"}, newLp: "dm"}),
	adaptLP({original: {subj: "KS"}, classIncludes:"21f",  newLp: "we~js"}),
	adaptLP({original: {subj: "KS"}, classIncludes:"21d",  newLp: "bi~em"}),
	adaptLP({original: {subj: "KS"}, classIncludes:"21a",  newLp: "ha~mj"}),
	new Rule({name: "add SK groups", matchByObj: {subj: "SK", klassen: ""},
		replaceByFunction: (entry, list)=>{
			let allGYM4 = [...new Set(list.map(l=>l.klassen.split(" ")[0]))].filter(k=>+k.slice(0,2)===SJE%1000).sort().join(" ")
			return Object.assign(entry, {klassen: allGYM4})
		}}),
	new Rule({name: "remove LT", matchByObj: {subj: "LT"}, remove: true}),
	new Rule({name: "remove Stv bl", matchByObj: {lp: "bl", klassen: ""}, remove: true}),
	new Rule({name: "add fTH groups", matchByObj: {subj: "fTH"}, replaceByObj: {klassen: "21b 21c 21e 23d 23f 23h"}}),
	setRoom({subj: "fSA", longroom: ""}, "?"),
	setRoom({subj: "fI", longroom: ""}, "?"),
	getRoomFromSameUnr({subj: "KS", longroom: ""}),
	getRoomFromSameUnr({subj: "sE", longroom: ""}),
	getRoomFromSameUnr({subj: "SLS", longroom: ""})
]

const adaptEventoSusToCourse = [
	
	// removeSusFromCourse(5423, 15399, "spr"),
	// addSusToCourse(5423, 15349, "spa")
]

function getRoomFromSameUnr(matchByObj) {
	return new Rule({
		name: `get room ${JSON.stringify(matchByObj)} via Unr`,
		matchByObj,
		replaceByFunction: Rule.getPropReplacer("longroom")
	})
}

function setRoom(matchByObj, longroom) {
	return new Rule({
		name: `set room ${JSON.stringify(matchByObj)}: => ${longroom}`,
		matchByObj, replaceByObj: {longroom}
	})
}

function removeSusFromCourse(sid, cid, comment) {
	return new Rule({
		remove: true,
		name: `remove ${sid} from ${cid} ${comment}`,
		matchByObj: [sid, cid],
	})
}

function addSusToCourse(sid, cid, comment) {
	return new Rule({
		once: true,
		name: `add ${sid} to ${cid} ${comment}`,
		addMultiple: _ => [[sid, cid]]
	})
}

function addPartnerCourse({original, classIncludes, semester, partner, cidDelta=9999} = {}) {
	return new Rule({
		name: `add Partner Course ${JSON.stringify(original)} => ${JSON.stringify(partner)}`,
		matchByFunction: entry => 
			Object.keys(original).every(key=>entry[key]===original[key]) &&
			entry.klassen.includes(classIncludes) &&
			(!semester || +entry.semester === semester),
		addMultiple: entry => [entry, {...entry, ...partner, cid: +entry.cid + cidDelta}]
	})
}

function adaptLP({semester, original, classIncludes = "", newLp}) {
	return new Rule({
		name: `change LP ${JSON.stringify(original)} ${classIncludes} => ${newLp}`,
		matchByFunction: entry => 
			Object.keys(original).every(key=>entry[key]===original[key]) &&
			entry.klassen.includes(classIncludes) &&
			(!semester || +entry.semester === semester),
		replaceByObj: {lp: newLp}
	})
}

module.exports = {adaptEventoCourses, adaptEventoSusToCourse, adaptStplCourses} //, stplEventsWithoutEventoGroup, skipEventoCourse, stplAdaptions, SJA, SJE}