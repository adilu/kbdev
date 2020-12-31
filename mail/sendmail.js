const sendmail = require("sendmail")({
	silent: true
})

function notifyAdmin(html, subject="notify") {
	sendmail({
		from: "klassenbuch@gymburdorf.ch",
		to: "adrian.luethi@gymburgdorf.ch",
		subject,
		html,
	}, function(err, reply) {
		if(err) console.warn(err && err.stack)
	})
}

module.exports = {notifyAdmin}