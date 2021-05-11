
//Stufe
const GYM1 = 1
const GYM2 = 2
const GYM3 = 3
const GYM4 = 4
const ALLESTUFEN = 5

//Tag
const [MO, DI, MI, DO, FR, GANZEWOCHE] = [1,2,3,4,5,9]

//Lektion
const [L0, L1, L2, L3, L4, L5, L6, L7, L8, L9, L10, L11, AB1545, VORMITTAG, NACHMITTAG, GANZERTAG] = 
[0,1,2,3,4,5,6,7,8,9,10,11,[8,9,10,11],44,55,99]

//Typ
const [INFO, AUSFALL, DELETE] = ["Info", "Ausfall", "delete"]

const SONDERSTUNDENPLAENE = [
	{SW: 3, Grund: "Intensivwoche 1"},
	{SW: 4, Grund: "Tage der offenen Tür"},
	{SW: 5, Grund: "Intensivwoche 2"},
	{SW: 7, Grund: "Intensivwoche 1"},
	{SW: 19, Grund: "Skilager"},
	{SW: 32, Grund: "Maturprüfungen"},
	{SW: 33, Grund: "Maturprüfungen"},
	{SW: 35, Grund: "Maturprüfungen"},
	{SW: 36, Grund: "Maturprüfungen"}
]

const EVENTS = [
	{
		"Info": "Sonderprogramm Schulbeginn",
		"SW": 0,
		"Tag": "Mo",
		"Lektion": [0,1,2,3,4,5],
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
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
		"Info": "MA Präsentationen",
		"SW": 14,
		"Tag": "Fr",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Weihnachtsferien",
		"SW": 16,
		"Tag": "Do",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Weihnachtsferien",
		"SW": 16,
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
		"Info": "Kollegiumshalbtag",
		"SW": 26,
		"Tag": "Mi",
		"Lektion": "AB_L5",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Karfreitag",
		"SW": 27,
		"Tag": "Fr",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Ostermontag",
		"SW": 28,
		"Tag": "Mo",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Auffahrt",
		"SW": 31,
		"Tag": "Do",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Auffahrtsbrücke",
		"SW": 31,
		"Tag": "Fr",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Pfingstmontag",
		"SW": 33,
		"Tag": "Mo",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "ohne GYM4",
		"SW": [32, 33, 34, 35, 36, 37, 38],
		"Tag": "GANZE_WOCHE",
		"Lektion": "GANZER_TAG",
		"Stufe": 4,
		"Typ": "AUSFALL"
	},
	{
		"Info": "Solennität",
		"SW": 38,
		"Tag": "Mo",
		"Lektion": "GANZER_TAG",
		"Stufe": "ALLE_STUFEN",
		"Typ": "AUSFALL"
	},
	{
		"Info": "Klassenkonferenzen",
		"SW": 38,
		"Tag": "Mi",
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
//Ostern, Pfingsten

/* ev.
Vorbereitungssitzung Fachwoche,
Studierende berichten live,
Uni Bern Besuchstag, 
Fachschaftstag,
Kollegiumstag,
Ostern
*/

module.exports = {SONDERSTUNDENPLAENE, EVENTS}