require('dotenv').config()
const logger = require('../middleware/logger')
const SibApiV3Sdk = require('sib-api-v3-sdk')

// TODO Forgotpassoword request
exports.forgotpassword = async (req, res) => {
  const mail = req.body.email
  console.log('requested forgot password mail', mail)

  const defaultClient = SibApiV3Sdk.ApiClient.instance
  const apiKey = defaultClient.authentications['api-key']
  apiKey.apiKey = process.env.FORGOT_API_KEY
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  // Set the sender
  sendSmtpEmail.sender = { name: process.env.SENDER_NAME, email: process.env.SENDER_MAIL }

  // Set the recipient
  sendSmtpEmail.to = [{ email: mail }]

  // Set the subject and HTML content of the email
  sendSmtpEmail.subject = 'Forgot Password'
  sendSmtpEmail.htmlContent = `
  <p>Hello,</p>
  <p>You have requested to reset your password. Please click the link below to proceed:</p>
  <p><a href="RESET_PASSWORD_URL">Reset Password</a></p>
  <p>If you did not request this, please ignore this email.</p>
  <p>Best regards,</p>
  <p>Your MoneyMentor Team</p>
`
  // Send the email
  apiInstance
    .sendTransacEmail(sendSmtpEmail)
    .then(function (data) {
      console.log('Email sent successfully:', data)
    })
    .catch(function (err) {
      logger.error('An error occurred:', err)
      console.error('Error sending email:', err)
    })
}
