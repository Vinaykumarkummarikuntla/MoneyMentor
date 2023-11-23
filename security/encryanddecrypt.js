const crypto = require('crypto');


// secret key for encryption and decryption
encryptionKey = crypto.randomBytes(32).toString('hex')

function generateRandomIV() {
  return crypto.randomBytes(16); // Use 16 bytes for AES-256-CBC
}


const constantIV = '02bf0ca8901070899eb190062845ba0c';

function encryptData(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(constantIV, 'hex'));
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}

// decrypt
function decryptData(encryptedData) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(constantIV, 'hex'));
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}



exports.encryptData = encryptData;
exports.decryptData = decryptData;




