// Tutorial
// https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1
const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const {loadSecret} = require("../isomorphic/loadSecret.js")
const OAuth2 = google.auth.OAuth2

const CLIENT_ID = loadSecret("mail_client_id")
const CLIENT_KEY = loadSecret("mail_client_key")
const REFRESH_TOKEN = loadSecret("mail_refresh_token")

const oauth2Client = new OAuth2(
	CLIENT_ID,
	CLIENT_KEY,
	"https://developers.google.com/oauthplayground" // Redirect URL
)

// oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
// const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: "diskstation@gymburgdorf.ch",
		clientId: CLIENT_ID,
		clientSecret: CLIENT_KEY,
		// refreshToken: REFRESH_TOKEN,
		// accessToken
	}
})

console.log(smtpTransport)

async function sendMail(user) {
	const mailOptions = {
		from: "diskstation@gymburgdorf.ch",
		to: "adrian.luethi@gymburgdorf.ch",
		subject: "Email-Test",
		generateTextFromHTML: true,
		html: `
      <h3>Hello</h3>
      <p>
      Seems to work</p>
		`
	}

	await new Promise((resolve, reject) => {
		smtpTransport.sendMail(mailOptions, (error, response) => {
			error ? reject(error) : resolve(response)
			//smtpTransport.close();
		})
	})
}

module.exports = {sendMail}