const {Rule} = require("../../import/Rule.js")

let eventoAdaptions = [
	createSubjectAdaptor("INF", "IN"),
	createSubjectAdaptor("EWR", "WR"),
	createSubjectAdaptor("Me", "M"),
	createSubjectAdaptor("GGe", "GG"),
	createSubjectAdaptor("Ge", "G"),
	createSubjectAdaptor("Gf", "iG"),
	createSubjectAdaptor("Cf", "iC"),
	createSubjectAdaptor("SPF", "SPf"),
	createSubjectAdaptor("SPM", "SPm"),
	createSubjectAdaptor("Salsa", "SA"),
	createSubjectAdaptor("A", "AS"),
	createSubjectAdaptor("ADV", "CA"),
	createSubjectAdaptor("HEB", "H"),
	createSubjectAdaptor("Disk", "DD"),
	createSubjectAdaptor("KM", "OR"),
	addSubjectPrefix("SF", "s"),
	addSubjectPrefix("EF", "e"),
	addSubjectPrefix("FF", "f"),
	new Rule({name: "adapt SK", matchByFunction: entry => entry.subj.match(/SK\d*/), replaceByObj: {subj: "SK"}}),
	new Rule({name: "skip MA", matchByObj: {subj: "MA"}, remove: true}),
	new Rule({name: "skip KUplus", matchByObj: {coursetype: "KUplus"}, remove: true}),
]

function createSubjectAdaptor(oldSubj, newSubj) {
	return new Rule({
		name: `adapt Evento Subject ${oldSubj} ${newSubj}`,
		matchByObj: {subj: oldSubj},
		replaceByObj: {subj: newSubj}
	})
}

function addSubjectPrefix(coursetypePrefix, prefix) {
	return new Rule({
		name: `add Subject Prefix ${coursetypePrefix} ${prefix}`,
		matchByFunction: entry => entry.coursetype.startsWith(coursetypePrefix),
		replaceByFunction: entry => {entry.subj = prefix + entry.subj; return entry}
	})
}

module.exports = {eventoAdaptions}