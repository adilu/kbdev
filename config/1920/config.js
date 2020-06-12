const CONFIG = {
	SJA: 2019,
	SJE: 2020,
	periods: [
		{
			short: "S1",
			name: "1. Semester",
			show: true,
			first: 0,
			last: 19
		},{
			short: "S2",
			name: "2. Semester",
			show: true,
			first: 20,
			last: 39
		},{
			short: "OP",
			name: "ohne Primen",
			show: true,
			first: 31,
			last: 39
		}
	]
}

// Support Node.js specific `module.exports` (which can be a function)
if (typeof module !== "undefined" && module.exports) {
	exports = module.exports = CONFIG
}
// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
if(typeof exports !== "undefined") {
	exports.MyModule = CONFIG
}