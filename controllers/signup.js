const bcrypt = require('bcrypt');
const crypto = require('crypto');
const signup = require('../models/signupmodel')
const logger = require('../middleware/logger')


// secret key for encryption and decryption
encryptionKey = crypto.randomBytes(32).toString('hex')

function generateRandomIV() {
  return crypto.randomBytes(16);
}

// encrypt 
function encryptData(data) {
  const iv = generateRandomIV();
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return { encryptedData, iv: iv.toString('hex') };
}

// decrypt 
function decryptData(encryptedData, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), Buffer.from(iv, 'hex'));
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}


// TODO Signup details
exports.signupdetails = async (req, res, next) => {
  try {
    // old code
    // const username = req.body.username
    // const email = req.body.email

    // new code   
    const username = encryptData(req.body.username)
    const email = encryptData(req.body.email)
    const password = req.body.password
    // console.log('the storing details are ' + username + ' and ' + email)

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    // password hashing
    const hashedPassword = await bcrypt.hash(password, salt)
    // console.log('hashedpassword', hashedPassword)

    const data = await signup.create({
      username,
      email,
      password: hashedPassword
    })
    res.status(200).json({ signupdetails: data })
  } catch (err) {
    logger.error('An error occurred:', err)
    // console.error(err);
  }
}
