function lessonMayHaveMultipleEventoCourses(lesson, courses) {
	
	if(courses.length === 2) {
		if(courses.map(c=>c.coursetype).sort().join() === "S3,Splus") {
			return true
		}
	}
	if(courses.length >= 2 && lesson.subj === "L") {
		if(courses.map(c=>c.coursetype).every(ct=>ct==="S3" || ct==="Splus")) {
			return true
		}
	}
}

const stplEventsWithoutEventoGroup = [
	"MPA","MNA","MUF","MBI","MVT","MRE","MA", //MA Module
	"SLS", "LT",
	"V", "Exk",
	"TAL","LT"
]

function isCourseWithAutoGroup(lesson) {
	return stplEventsWithoutEventoGroup.includes(lesson.subj)
}

// Support Node.js specific `module.exports` (which can be a function)
if (typeof module !== "undefined" && module.exports) {
	exports = module.exports = {isCourseWithAutoGroup, stplEventsWithoutEventoGroup}
}
// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
if(typeof exports !== "undefined") {
	exports.MyModule = {isCourseWithAutoGroup, stplEventsWithoutEventoGroup}
}