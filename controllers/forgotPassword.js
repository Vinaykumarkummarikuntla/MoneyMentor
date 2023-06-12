require('dotenv').config()
const SibApiV3Sdk = require('sib-api-v3-sdk')

exports.forgotpassword = async (req, res) => {

  const mail = req.body.email
  console.log("requested forgot password mail",mail)


  const defaultClient = SibApiV3Sdk.ApiClient.instance

  const apiKey = defaultClient.authentications['api-key']
  apiKey.apiKey = process.env.FORGOT_API_KEY
  // apiKey.apiKey = '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'; // Replace with your Sendinblue API key or use process.env to fetch from environment variables

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  // Set the sender
  sendSmtpEmail.sender = { name: 'MoneyMentor', email: 'kvk.9618@gmail.com' }

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
  apiInstance.sendTransacEmail(sendSmtpEmail)
    .then(function (data) {
      console.log('Email sent successfully:', data)
    })
    .catch(function (error) {
      console.error('Error sending email:', error)
    })
}
