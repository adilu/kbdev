function normalizeSoft(eventoEntry) {
	//console.log(eventoEntry)
	let {
		"Person | Id": sid,
		"Person | Nachname": lastname,
		"Person | Vorname1": firstname,
		"Person | Anmeldungen_Alle_AusbildungStudienjahrgang": classfield,
		"Anlass | AnlassNr": courseDescription,
		"_Anlass | AnlassNr": cid,
		"Anlass | Leitungsrollen": teacherfield,
		"Person | EMail": email,
		"Status": status,
		"_Status": statusId,
		"PK1": unknownIgnored,
		"PK2": pk2,
		...rest
	} = eventoEntry

	if(!sid) sid = pk2

	classfield = classfield || ""
	teacherfield = teacherfield || ""

	classfield = classfield.replace(/@Key\d+,\d+\|/g, "")
	classfield = classfield.replace(/♫/gu, "")
	teacherfield = teacherfield.replace(/\|Hauptleitung\s+\(Ressource\):/gu, " HL:")
	teacherfield = teacherfield.replace(/\|Stv. Verantwortliche\/r\s\s\(Person\):/gu, " Stv:")
	teacherfield = teacherfield.replace(/@Key/gu, "")
	teacherfield = teacherfield.replace(/♫/gu, "")
	teacherfield = teacherfield.replace(/\s\*(?!$)/gu, ";")
	teacherfield = teacherfield.replace(/\s\*(?:$)/gu, "")
	teacherfield = teacherfield.replace(/\s+/gu, " ")

	if(Object.keys(rest).length) {
		console.warn({objHasUnknownProperties: rest})
	}

	return {sid, lastname, firstname, classfield, courseDescription, cid, teacherfield, email, status, statusId, pk2, ...rest}

}

module.exports = {normalizeSoft}