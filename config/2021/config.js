const CONFIG = {
	SJA: 2020,
	SJE: 2021,
}

//if necessary adapt periods in getDatehelpers

// Support Node.js specific `module.exports` (which can be a function)
if (typeof module !== "undefined" && module.exports) {
	exports = module.exports = CONFIG
}
// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
if(typeof exports !== "undefined") {
	exports.MyModule = CONFIG
}