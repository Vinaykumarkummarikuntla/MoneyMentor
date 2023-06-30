require('dotenv').config()
const id = process.env.TWILLIOSID
const token = process.env.TWILLIOAUTHTOKEN

// const id = AC1de1a6cd56f7faa9eb3b55167a9d5eda
// const token = 4c761dbec8e694c3c07c8b4fca2645fd

// Importing the Twilio module
const twilio = require('twilio')

// Creating a client
const client = twilio(id, token)

// Sending messages to the client
const thresholdAmount = 1000 // The amount that triggers the notification

// Function to send WhatsApp notification
async function sendWhatsAppNotification (recipientNumber, message) {
  console.log('NOTIFICATION CALLED =======================================>')
  try {
    //     // Send API request to the WhatsApp API provider
    client.messages
      .create({
        // Message to be sent
        body: message,

        // Senders Number (Twilio Sandbox No.)
        from: 9618421328,

        // Number receiving the message
        to: recipientNumber
      })
      .then((message) => console.log('Message sent successfully'))
      .done()
    console.log('WhatsApp notification sent successfully')
    // Update application status or flag to indicate that the notification was sent
    // You can store this information in your database or memory
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
    // Handle the error, retry the notification, or log the failure
  }
}

// Example logic to check the amount and trigger the notification
exports.checkAmountAndSendNotification = function (amount, recipientNumber) {
  if (amount >= thresholdAmount) {
    const message = `Hello from Money Mentor! Your expenses total amount has reached ${thresholdAmount}.`
    sendWhatsAppNotification(recipientNumber, message)
  } else {
    console.log('Amount has not reached the threshold yet.')
  }
}

// // Example usage
// const currentAmount = 1200 // Retrieve the current amount from your application's data or database
// const recipientNumber = 7013692936 // The recipient's WhatsApp number

// checkAmountAndSendNotification(currentAmount, recipientNumber)
