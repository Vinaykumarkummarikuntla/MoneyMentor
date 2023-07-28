
const mongoose = require('mongoose');

// Define the Mongoose Schema
const reportDownloadedSchema = new mongoose.Schema({
  userId: {
    type: Number,
  },
  fileURL: String,
});

// Create the Mongoose Model for 'reportdownloaded'
const ReportDownloaded = mongoose.model('reportdownloaded', reportDownloadedSchema);

module.exports = ReportDownloaded;
