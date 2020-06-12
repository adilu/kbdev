const fs = require("fs").promises
const {normalizeSoft} = require("./_312_eventoNormalizeSoft")

async function run() {
	let entries = await fs.readdir("./1920/evento_ev_old")
	for(let f of entries) {
		let n = f.split("T")[0] + "T" + f.split("T")[1].replace(/-/g, ":")
		let t = n.split("_")[2].split(".")[0]
		let d = new Date(t).getTime()
		let content = await fs.readFile("./1920/evento_ev_old/" + f, "UTF-8")
		await fs.writeFile("./1920/evento_ev_new/evento_" + d + ".json", content)
	}
}

//run();

async function normalize() {
	let entries = await fs.readdir("./1920/evento_extractedVersions_Unnormalized")
	for(let f of entries.filter(e=>e.endsWith("json"))) {
		let content = await fs.readFile("./1920/evento_extractedVersions_Unnormalized/" + f, "UTF-8")
		let obj = JSON.parse(content)
		let newObj = obj.map(normalizeSoft)
		if(obj.length !== newObj.length) {
			console.warn({objsHaveDifferentLength: {obj: obj.length, newObj: newObj.length}})
		}
		await fs.writeFile("./1920/evento_extractedVersions/" + f, JSON.stringify(newObj, null, "  "))
	}
}

normalize()



