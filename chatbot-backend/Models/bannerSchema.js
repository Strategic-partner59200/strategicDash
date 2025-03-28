const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", 
    required: true,
  },
  title: { type: String, required: true },
  mainText: { type: String, required: true },  
  imageUrl: { type: String },
  platform: {
    type: String,
    enum: ["Facebook", "YouTube", "Instagram"],
    // required: true,
  },
  facebookFields: {
    accessToken: {
      type: String,
      required: function () {
        return this.platform === "Facebook";
      },
      trim: true,
    },
    adAccountId: {
      type: String,
      required: function () {
        return this.platform === "Facebook";
      },
      trim: true,
    },
  },
  youtubeFields: {
    adIdYoutube: {
      type: String,
      required: function () {
        return this.platform === "YouTube";
      },
      trim: true,
    },
    AccountYoutubeId: {
      type: String,
      required: function () {
        return this.platform === "YouTube";
      },
      trim: true,
    },
  },
  instagramFields: {
    adIdInstagram: {
      type: String,
      required: function () {
        return this.platform === "Instagram";
      },
      trim: true,
    },
    adAccountIdInstagram: {
      type: String,
      required: function () {
        return this.platform === "Instagram";
      },
      trim: true,
    },
    isActive: { type: Boolean, default: false },
  },
}, { timestamps: true });

module.exports = mongoose.model("Banner", BannerSchema);
