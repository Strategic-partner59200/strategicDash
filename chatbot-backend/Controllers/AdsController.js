const Banner = require("../Models/bannerSchema");
const Publicity = require("../Models/pubSchema");
const mongoose = require("mongoose");

class AdsController {
  static async createBanner(req, res) {
    try {
      const {
        title,
        userId,
        mainText,
        imageUrl,
        platform,
        accessToken,
        adAccountId,
        adIdYoutube,
        AccountYoutubeId,
        adIdInstagram,
        adAccountIdInstagram,
      } = req.body;

      // Build the Banner object dynamically based on the platform
      const bannerData = {
        title,
        mainText,
        imageUrl,
        platform,
        admin: userId,
      };
      // Add platform-specific fields
      if (platform === "Facebook") {
        bannerData.facebookFields = {
          accessToken,
          adAccountId,
        };
      } else if (platform === "YouTube") {
        bannerData.youtubeFields = {
          adIdYoutube,
          AccountYoutubeId,
        };
      } else if (platform === "Instagram") {
        bannerData.instagramFields = {
          adIdInstagram,
          adAccountIdInstagram,
        };
      }

      // Create and save the new banner
      const newBanner = new Banner(bannerData);
      const savedBanner = await newBanner.save();

      res
        .status(201)
        .json({ message: "Banner created successfully!", banner: savedBanner });
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({ error: "Failed to create banner." });
    }
  }

  static async getBanners(req, res) {
    try {
      const banners = await Banner.find();
      res.status(200).json(banners);
    } catch (error) {
      console.error("Error getting banners:", error);
      res.status(500).json({ error: "Failed to get banners." });
    }
  }

  static async deleteBanner(req, res) {
    const { id } = req.params;

    try {
      const banner = await Banner.findByIdAndDelete(id); // Find the banner by ID in the database

      if (!banner) {
        return res.status(404).json({ message: "Banner not found" }); // Handle if the banner doesn't exist
      }

      return res.status(200).json({ message: "Banner deleted successfully" }); // Respond with success message
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting banner" }); // Handle any errors
    }
  }

  // Update banner by ID
  static async updateBanner(req, res) {
    const { id } = req.params;
    const updatedData = req.body; // Get the updated data from the request body

    try {
      const banner = await Banner.findById(id); // Find the banner by ID in the database

      if (!banner) {
        return res.status(404).json({ message: "Banner not found" }); // Handle if the banner doesn't exist
      }

      // Update the banner's data
      Object.assign(banner, updatedData);

      await banner.save(); // Save the updated banner back to the database

      return res
        .status(200)
        .json({ message: "Banner updated successfully", banner }); // Respond with success message and updated banner
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating banner" }); // Handle any errors
    }
  }

  // Get banner by ID
  static async getBannerById(req, res) {
    try {
      const { id } = req.params;
      console.log("Banner ID:", id);

      // Check if id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid banner ID" });
      }

      const banner = await Banner.findById(id);

      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      res.status(200).json(banner);
    } catch (error) {
      console.error("Error fetching banner:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async createPub(req, res) {
    try {
      const { title, userId, mainText, imageUrl, link } = req.body;

      // Build the Banner object dynamically based on the platform
      const pubData = {
        title,
        mainText,
        imageUrl,
        admin: userId,
        link,
      };

      // Create and save the new banner
      const newPub = new Publicity(pubData);
      const savedPub = await newPub.save();

      res
        .status(201)
        .json({ message: "Pub created successfully!", banner: savedPub });
    } catch (error) {
      console.error("Error creating pub:", error);
      res.status(500).json({ error: "Failed to create pub." });
    }
  }

  static async getPubs(req, res) {
    try {
      const pubs = await Publicity.find();
      res.status(200).json(pubs);
    } catch (error) {
      console.error("Error getting pubs:", error);
      res.status(500).json({ error: "Failed to get pubs." });
    }
  }

  static async deletePub(req, res) {
    const { id } = req.params;

    try {
      const pub = await Publicity.findByIdAndDelete(id); // Find the banner by ID in the database

      if (!pub) {
        return res.status(404).json({ message: "pub not found" }); // Handle if the banner doesn't exist
      }

      return res.status(200).json({ message: "pub deleted successfully" }); // Respond with success message
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting pub" }); // Handle any errors
    }
  }

  // Update banner by ID
  static async updatePub(req, res) {
    const { id } = req.params;
    const updatedData = req.body; // Get the updated data from the request body

    try {
      const pub = await Publicity.findById(id); // Find the banner by ID in the database

      if (!pub) {
        return res.status(404).json({ message: "pub not found" }); // Handle if the banner doesn't exist
      }

      // Update the banner's data
      Object.assign(pub, updatedData);

      await pub.save(); // Save the updated banner back to the database

      return res
        .status(200)
        .json({ message: "Banner updated successfully", pub }); // Respond with success message and updated banner
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating pub" }); // Handle any errors
    }
  }

  // Get banner by ID
  static async getPubById(req, res) {
    try {
      const { id } = req.params;
      console.log("pub ID:", id);

      // Check if id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid pub ID" });
      }

      const pub = await Publicity.findById(id);

      if (!pub) {
        return res.status(404).json({ message: "pub not found" });
      }

      res.status(200).json(pub);
    } catch (error) {
      console.error("Error fetching pub:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = AdsController;
