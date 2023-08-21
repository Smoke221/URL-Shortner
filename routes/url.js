const express = require("express");
const shortid = require("shortid");
const { ShortUrlModel } = require("../models/url");

const urlRouter = express.Router();

urlRouter.post("/short", async (req, res) => {
  try {
    const requestedURL = req.body;
    if (!requestedURL.url)
      return res.status(400).json({ error: "URL is required" });

    // Check if the URL already exists in the database
    const existingShortURL = await ShortUrlModel.findOne({
      originalUrl: requestedURL.url,
    });

    if (existingShortURL) {
      // URL already has a short code, so return the existing short code
      res
        .status(200)
        .json({
          message: "Short URL already exists",
          shortCode: existingShortURL.shortCode,
        });
    } else {
      // URL doesn't exist, create a new short code
      const shortID = shortid.generate(); // Use shortid.generate() to create a new short ID
      const shortURL = new ShortUrlModel({
        originalUrl: requestedURL.url,
        shortCode: shortID,
      });
      await shortURL.save();
      res
        .status(200)
        .json({ message: "Short URL created", shortCode: shortID });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

urlRouter.get("/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;

  // Find the original URL based on the short code
  const shortUrl = await ShortUrlModel.findOne({ shortCode });

  if (shortUrl) {
    // Extract metadata from the request
    const userAgent = req.get("User-Agent");
    const ipAddress = req.ip;
    const referralSource = req.get("Referer");

    // Create a new click history entry
    const clickEntry = {
      timestamp: new Date(),
      userAgent,
      ipAddress,
      referralSource,
    };

    // Update the visitedHistory array in the database
    await ShortUrlModel.findByIdAndUpdate(shortUrl._id, {
      $push: { visitedHistory: clickEntry },
      $inc: { clickCount: 1 },
    });

    // Redirect the user to the original URL
    res.redirect(shortUrl.originalUrl);
  } else {
    res.status(404).send("Short URL not found");
  }
});

module.exports = { urlRouter };
