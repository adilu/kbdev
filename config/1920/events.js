
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
		Info: "Sonderprogramm Schulbeginn",
		SW: 0,
		Tag: MO,
		Lektion: VORMITTAG,
		Stufe: ALLESTUFEN,
		TYP: AUSFALL
	},
	{
		Info: "Tag der offenen Tür",
		SW: 4,
		Tag: MI,
		Lektion: VORMITTAG,
		Stufe: ALLESTUFEN,
		Typ: INFO
	},
	{
		Info: "Präsentation Schwerpunktfächer",
		SW: 4,
		Tag: MI,
		Lektion: NACHMITTAG,
		Stufe: ALLESTUFEN,
		Typ: AUSFALL
	},
	{
		Info: "Tag der offenen Tür",
		SW: 4,
		Tag: DO,
		Lektion: GANZERTAG,
		Stufe: ALLESTUFEN,
		Typ: INFO
	},
	{
		Info: "Ferienbeginn",
		SW: 5,
		Tag: FR,
		Lektion: AB1545,
		Stufe: ALLESTUFEN,
		Typ: AUSFALL
	},
	{
		Info: "Fachwoche",
		SW: 9,
		Tag: GANZEWOCHE,
		Lektion: GANZERTAG,
		Stufe: ALLESTUFEN,
		Typ: AUSFALL
	},
	{
		Info: "MA Präsentationen",
		SW: 14,
		Tag: FR,
		Lektion: GANZERTAG,
		Stufe: ALLESTUFEN,
		Typ: AUSFALL
	},
	{
		Info: "Klassenkonferenzen",
		SW: 19,
		Tag: MI,
		Lektion: [L3, L4, L5, L6, L7, L8 , L9, L10, L11],
		Stufe: ALLESTUFEN,
		Typ: AUSFALL
	},
	{
		Info: "Mulus",
		SW: 34,
		Tag: DI,
		Lektion: [L5, L6, L7],
		Stufe: GYM4,
		Typ: INFO
	},
	{
		Info: "Ende GYM4",
		SW: 34,
		Tag: [MI, DO, FR],
		Lektion: GANZERTAG,
		Stufe: GYM4,
		Typ: DELETE
	},
	{
		Info: "Ende GYM4",
		SW: [35, 36, 37, 38, 39, 40],
		Tag: GANZEWOCHE,
		Lektion: GANZERTAG,
		Stufe: GYM4,
		Typ: DELETE
	},
]

/* ev.
Vorbereitungssitzung Fachwoche,
Studierende berichten live,
Uni Bern Besuchstag, 
Fachschaftstag,
Kollegiumstag,
Ostern
*/

module.exports = {SONDERSTUNDENPLAENE, EVENTS}