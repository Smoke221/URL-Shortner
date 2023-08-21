const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    unique: true,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  visitedHistory: [
    {
      timestamp: Date,
      userAgent: String,
      ipAddress: String,
    },
  ],
});

const ShortUrlModel = mongoose.model("ShortUrl", shortUrlSchema);

module.exports = { ShortUrlModel };
