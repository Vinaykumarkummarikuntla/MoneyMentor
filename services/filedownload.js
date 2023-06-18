const reportdownload = require('../models/reportdownloadedmodel')

exports.storeURLInDB = async (userid, filename) => {
  try {
    const URLDetails = await reportdownload.create({
      userId: userid,
      fileURL: filename

    })
    console.log('URL details stored in the database:', URLDetails);
  } catch (err) {
    console.error(err)
  }
}
