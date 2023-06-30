// const nodemailer = require('nodemailer');

// async function sendEmailNotification(recipientEmail, message) {
//   try {
//     // SMTP server configuration
//     const smtpConfig = {
//       host: 'your_smtp_server',
//       port: 587,
//       secure: false,
//       auth: {
//         user: 'your_username',
//         pass: 'your_password'
//       }
//     };

//     // Create a transporter
//     const transporter = nodemailer.createTransport(smtpConfig);

//     // Create the email message
//     const mailOptions = {
//       from: 'your_email@example.com',
//       to: recipientEmail,
//       subject: 'Mounthly report ',
//       text: `Dear user,\n\n${message}\n\n`
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);
//     console.log('Email notification sent successfully');
//   } catch (error) {
//     console.error('Error sending email notification:', error);
//   }
// }

// // Example usage
// const recipientEmail = 'user@example.com';
// const Message = 'hi';
// sendEmailNotification(recipientEmail, emiMessage);
