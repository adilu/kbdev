function extractTimestamps(lists) {
	return [...new Set(Object.keys(lists).map(v=>+v.split("_")[1]))].sort()
}

function timestampToDate(timestamp) {
	return new Date(timestamp).toLocaleString("de-ch", {year: "numeric", month: "2-digit", day: "2-digit"})
}

function timestampToDateTime(timestamp) {
	const ZZ = "2-digit"
	return new Date(timestamp).toLocaleString("de-ch", {year: "numeric", month: ZZ, day: ZZ, hour: ZZ, minute: ZZ})
}

function displayDate(timestamp) {
	return `<span title=${timestamp}>${timestampToDateTime(timestamp)}</span>`
}


function diffByJson(current, old) {
	let oldJSON = old.map(JSON.stringify)
	let currentJSON = current.map(JSON.stringify)
	let added = currentJSON.filter(entry=>!oldJSON.includes(entry)).map(JSON.parse)
	let removed = oldJSON.filter(entry=>!currentJSON.includes(entry)).map(JSON.parse)
	return {added, removed}
}

