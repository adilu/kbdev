//Gültige Werte:
//SW: 0-38 oder [33, 34, 35] oder "12.12."
//Tag: 1-5 oder "Mo", "Di", ... oder "GANZE_WOCHE"
//Lektion: 0-11 oder [5,6,7] oder "GANZER_TAG" oder "AB_L5" oder "AB_L6" oder "AB_L8"
//Stufe: 1-4 oder [1,2] oder "ALLE_STUFEN"
//Typ: "INFO" oder "AUSFALL" oder "DELETE"

let eventlist = [
	{
		"Info": "Sonderprogramm Schulbeginn",
		"SW": 0,
		"Tag": "Mo",
		"Lektion": [0,1,2,3,4,5],
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Tag der offenen Tür",
		"SW": 4,
		"Tag": "Mi",
		"Lektion": [0,1,2,3,4,5],
		"Stufe": "ALLE_STUFEN",
		"Typ": "INFO"
	},
	{
		"Info": "Präsentation Schwerpunktfächer",
		"SW": 4,
		"Tag": "Mi",
		"Lektion": "AB_L6",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Tag der offenen Tür",
		"SW": 4,
		"Tag": "Do",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "INFO"
	},
	{
		"Info": "Ferienbeginn",
		"SW": 5,
		"Tag": "Fr",
		"Lektion": "AB_L9",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Vorbereitungssitzung Fachwoche",
		"SW": 6,
		"Tag": "Do",
		"Lektion": 4,
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Fachwoche",
		"SW": 9,
		"Tag": "GANZE_WOCHE",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Studierende berichten live",
		"SW": 11,
		"Tag": 4,
		"Lektion": "AB_L6",
		"Stufe": [3, 4],
		"Typ": "AUSFALL"
	},
	{
		"Info": "Kantonaler Fachschaftstag",
		"SW": 13,
		"Tag": 2,
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "MA Präsentationen",
		"SW": 14,
		"Tag": "Fr",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Klassenkonferenzen",
		"SW": 19,
		"Tag": "Mi",
		"Lektion": "AB_L5",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Mulus",
		"SW": 31,
		"Tag": "Mi",
		"Lektion": [5,6,7],
		"Stufe": "ALLE_STUFEN",
		"Typ": "INFO"
	},
	{
		"Info": "Auffahrt",
		"SW": "20.05.",
		"Tag": "Do",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Auffahrtsbrücke",
		"SW": "21.05.",
		"Tag": "Fr",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Pfingstmontag",
		"SW": "01.06.",
		"Tag": "Mo",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Ende GYM4",
		"SW": 34,
		"Tag": [3,4,5],
		"Lektion": "GANZER_TAG",
		"Stufe": 4,
		"Typ": "DELETE"
	},
	{
		"Info": "Ende GYM4",
		"SW": [35, 36, 37, 38, 39, 40],
		"Tag": "GANZE_WOCHE",
		"Lektion": "GANZER_TAG",
		"Stufe": 4,
		"Typ": "DELETE"
	},
	{
		"Info": "Solennität abgesagt",
		"SW": "30.06.",
		"Tag": "Mo",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "INFO"
	},
	{
		"Info": "Klassenkonferenzen",
		"SW": 38,
		"Tag": "Di",
		"Lektion": "AB_L5",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	}
]
//ev.
//Vorbereitungssitzung Fachwoche,
//Studierende berichten live,
//Uni Bern Besuchstag, 
//Fachschaftstag,
//Kollegiumstag,
//Ostern
