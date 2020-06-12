function normalizeHard(eventoEntry, SJE, lplist) {

	function classToEventoLevel(XXa) {
		return SJE%2000 + 4 - parseInt(XXa) 
	}

	let {sus, lastname, firstname, classfield,
		courseDescription, cid, teacherfield,
		email, status, /*statusId, pk2, ...rest*/} = eventoEntry
	
	//Kursnummer verarbeiten (z. B. 1-1-MA-GF15-15d, 14-1-CH-FF-GYM20-18bdef19ac20df21fh)
	//@check might be irrelevant after 1920
	let modulArray = courseDescription.split("-")
	let eventoLevel, semester, subj, coursetype, courseyear, coursetypeyear, eventoClasses
	if(modulArray.length === 4) { //alter Lehrplan nur SK
		[eventoLevel, semester, subj, eventoClasses] = modulArray
		eventoLevel = 5 - eventoLevel
		coursetype = "SK"
		courseyear = subj.slice(-2)
	}
	else if(modulArray.length === 5) { //alter Lehrplan
		[eventoLevel, semester, subj, coursetypeyear, eventoClasses] = modulArray
		eventoLevel = 5 - eventoLevel
		coursetype = coursetypeyear.slice(0, -2)
		courseyear = coursetypeyear.slice(-2)
	}
	else {
		[eventoLevel, semester, subj, coursetype, courseyear, eventoClasses] = modulArray
		courseyear = courseyear.slice(3)
	}
	semester = + semester

	if(+courseyear !== SJE%2000) {
		//if(!(+courseyear>10)) console.warn("cannot read course: ", resultline);
		return null
	}
	console.assert(+eventoLevel === 14 || eventoClasses.split(/\D/g).map(classToEventoLevel).includes(+eventoLevel), "Evento Level Mismatch", courseDescription, eventoLevel, classToEventoLevel(eventoClasses))

	let lpsearch = (teacherfield||"").match(/: ([A-zäöüèéàñ\- ]*)/u)
	let lplong = lpsearch === null ? "" : lpsearch[1].trim().split("  ").join(" ")
	let lpcand = lplist.find(l=>(lplong.includes(l[1]) && lplong.includes(l[2])) || l[5]===lplong)
	console.assert(lpcand || lplong==="", "Unknown teacher: ", teacherfield)
	let lp = lpcand ? lpcand[0] : lplong

	let classes = [], m, re = /((?<=(\d\d)\D*)(\D))/g
	// eslint-disable-next-line no-cond-assign
	while (m = re.exec(eventoClasses)) {
		classes.push(m[2] + m[3])
	}
	let klassen = classes.join(" ")
	
	if(!email) {
		email = firstname.split(" ")[0] + "." + lastname.split(" ")[0] + "@gymburgdorf.ch"
	}

	email = email.toLowerCase().slice(0, email.indexOf("@gymburgdorf.ch"))
	//subj = adaptEventoSubj(subj, coursetype) //is now in eventoExtract

	let klasse, isonleave = false
	if(!classfield) {
		klasse = false
	}
	else {
		let currentClasses = classfield.match(/\d\d[a-z]; jA.(Aufgenommen|Temporär|Wird eintreten)/g)
		isonleave = classfield.match(/\d\d[a-z]; jA.(Beurlaubt)/g)
		if(isonleave) {
			klasse = isonleave[0].slice(0,3)
			if(currentClasses && classToEventoLevel(eventoClasses) !== classToEventoLevel(klasse) ) {
				isonleave = false //was on leave in earlier year
			}
		}
		else if(status !== "aA.Angemeldet" || !currentClasses || currentClasses.length !== 1) {
			//console.warn("!!!");
			//console.warn(resultline);
		}
		else {
			klasse = currentClasses[0].slice(0,3)
		}
	}

	return ({cid, subj, lp, klassen, coursetype, semester, sus, email, firstname, lastname, klasse, isonleave})
}

module.exports = {normalizeHard}