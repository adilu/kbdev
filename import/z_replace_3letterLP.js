const SJ = "2021"

const fs = require("fs")

let olp = require(`../config/${SJ}/lp_old.json`)
let nlp = require(`../config/${SJ}/lp.json`)

function replace(old_short, f) {
	if(old_short.length===3) return old_short
	if(old_short==="") return ""
	let o = olp.find(l=>l[0]===old_short)
	if(o) {
		let n = nlp.find(l=>l[3]===o[3])
		if(n)	return n[0]
	}
	console.warn({old_short, o, f})

}

for(let f of fs.readdirSync(`../root_data/${SJ}/stpl_raw_archive`).filter(file=>file.startsWith("extracted"))) {
	let d = fs.readFileSync(`../root_data/${SJ}/stpl_raw_archive/` + f, "utf-8")
	let replaced = d.split("\r\n").map(r=>r.split(",").map((o,i)=> i===0 ? replace(o, f): o).join(",")).join("\r\n")
	fs.writeFileSync(`../root_data/${SJ}/stpl_raw/` + f, replaced)
}
