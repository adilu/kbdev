let rules = []

/**
 * 	name,
		matchByFunction,
		matchByObj,
		replaceByFunction,
		replaceByObj,
		filter,
		addObjsToListFunction
 */
class Rule {
	/**
	 * 
	 * @param {Object} props
	 * @param {Function=} props.matchByFunction
	 * @param {Function=} props.replaceByFunction
	 * @param {Object=} props.matchByObject
	 * @param {Object=} props.replaceByObject
	 * @param {string=} props.name
	 */
	constructor(props) {
		Object.assign(this, props)
		this.matched = 0
		this.used = 0
		rules.push(this)
	}
	check(list) {
		let newList = []
		list.forEach((entry)=>{
			let functionMatches = !this.matchByFunction || this.matchByFunction(entry)
			let objectMatches = !this.matchByObj || Object.keys(this.matchByObj).every(k=>entry[k]===this.matchByObj[k])
			let isMatch = functionMatches && objectMatches && !this.once
			if(isMatch) {
				this.matched++
				newList = this.invoke(entry, list, newList)
			}
			else newList.push(entry)
		})
		if(this.once) {
			console.assert(this.addMultiple)
			newList = this.invoke(null, list, newList)
		}
		return newList
	}
	invoke(entry, list, newList) {
		if(this.replaceByFunction) {
			this.used++
			newList.push(this.replaceByFunction(entry, list))
		}
		else if(this.addMultiple) {
			this.used++
			newList = newList.concat(this.addMultiple(entry, list))
		}
		else if(this.replaceByObj) {
			let willChange = Object.keys(this.replaceByObj).some(k=>entry[k]!==this.replaceByObj[k])
			if(willChange) {
				this.used++
				Object.assign(entry, this.replaceByObj)
			}
			newList.push(entry)
		}
		else if(this.remove) {
			this.used++
		}
		return newList
	}
	static getAllRules() {
		return rules
	}
	log() {
		console.log(`Rule ${this.name}: ${this.matched} / ${this.used}`)
	}
	static getPropReplacer(prop) {
		return (entry, list) => {
			let val = findPropViaUnr(entry, prop, list)
			if(val) entry[prop] = val
			return entry}
	}
}

function findSameUnr(instance, instances) {
	return instances.filter(i=>i!==instance && ["unr", "jsw", "weekday", "daylesson"].every(k=>i[k]===instance[k]))
}

function findPropViaUnr(instance, prop, instances) {
	let candis = findSameUnr(instance, instances)
	let values = candis.map(c=>c[prop]).filter(x=>!!x)
	let value = values.length && values.every(p=>p===values[0]) ? values[0] : false
	return value
}

module.exports = {Rule}

// class StplRule extends Rule {
// 	constructor(props) {
// 		super(name)
// 		this.matcher = matcher
// 		this.replacer = replacer
// 		this.used = 0
// 		this.matched = 0
// 		this.name = name
// 		stplRules.push(this)
// 	}

// }

// function adaptEventoCourse(course, results) {
// 	let {cid, subj, lp, semester, klassen, coursetype, ...susprops} = course

// 	if(SJE===2020) {
// 		// if(subj==="KS" && klassen.includes("21a")) lp = "mj";
// 		// if(subj==="KS" && klassen.includes("21f")) lp = "we";
// 		// if(subj==="E" && klassen.includes("22f")) lp = "sm";

// 		if(semester === 1) {
// 			if(subj === "sR" && klassen.startsWith("20") && lp==="kr") results.push(Object.assign({}, course, {lp: "cf", cid: cid + 9999}))
// 		}
// 		if(semester === 2) {
			
// 			//if(subj === "sR" && klassen.startsWith("22") && lp==="kr") results.push(Object.assign({}, course, {lp: "cf", cid: cid + 9999}));
// 			if(subj === "sW" && klassen.includes("22b")) results.push(Object.assign({}, course, {subj: "sR", lp: "cf", cid: cid + 9999}))
// 			if(subj === "sW" && klassen.includes("22a")) results.push(Object.assign({}, course, {subj: "sR", lp: "cf", cid: cid + 9999}))
// 			if(subj === "sW" && klassen.includes("22b")) results.push(Object.assign({}, course, {subj: "WR", lp: "kr", cid: cid + 9998}))
// 			//if(subj === "sW" && klassen.startsWith("21")) results.push(Object.assign({}, course, {lp: "cf", subj: "sR", cid: cid + 9999}));
// 			//if(subj === "sW" && klassen.startsWith("20")) results.push(Object.assign({}, course, {lp: "kr", subj: "sR", cid: cid + 9999}));
// 			//if(subj === "sR" && klassen.includes("21b")) klassen = "21b";
// 		}

// 		//LP change!!
// 		if(semester === 1) {
// 			if(subj === "M" && klassen === "23f" && lp==="bl") lp = "sb"
// 			if(subj === "M" && klassen === "21e" && lp==="bl") lp = "ot"
// 			if(subj === "M" && klassen === "21f" && lp==="bl") lp = "gl"
// 		}
// 		if(semester === 2) {
// 			if(subj === "B" && klassen === "23a" && lp==="lm") lp = "hr"
// 		}

// 		if(subj === "BG" && klassen === "20a" && lp==="an") lp = "lo"
// 		if(subj === "P" && klassen === "21c" && lp==="sb") lp = "sa"
// 		if(subj === "KS" && klassen === "21f" && lp==="js") lp = "we"

// 		// if(subj === "SPf" && lp==="gi" && cst === "3f") {
// 		//   // let othergroup = ecl.find(c=>c.cnr==="3fg-SPm-lw");
// 		//   // console.log("BE CARFUL: Boys 3f Sport with SPW 3f, Boys 3g Sport with SPW 3g");
// 		//   // course.group = course.group.concat(othergroup.group);
// 		//   // course.classArray = course.classArray.concat(othergroup.classArray);
// 		//   // ecl.splice(ecl.indexOf(othergroup), 1);
// 		//   // course.subj = "SP"; course.cnr = "3fg-SP-gi";
// 		// }
// 	}

// class EventoRule extends Rule {
// 	constructor(name) {
// 		super(name)
// 	}
// }

// class AdaptEventoSubj extends EventoRule {
// 	constructor(name) {
// 		super(name)
// 	}
// }