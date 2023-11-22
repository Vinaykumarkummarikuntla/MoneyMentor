const crypto = require('crypto');


const encryptionKey = crypto.randomBytes(32).toString('hex');

function generateRandomIV() {
  return crypto.randomBytes(16);
}

function encryptData(data) {
  const iv = generateRandomIV();
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return { encryptedData, iv: iv.toString('hex') };
}

function decryptData(encryptedData, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), Buffer.from(iv, 'hex'));
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}


exports.encryptData = encryptData;
exports.decryptData = decryptData;




