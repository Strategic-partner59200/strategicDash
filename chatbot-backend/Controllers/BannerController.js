const Banner = require("../Models/bannerSchema");
const axios = require("axios");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


class BannerController {
  static toggleAdStatus = async (req, res) => {
    const { id } = req.params; // Get banner ID from URL params
    const { platform } = req.body;
    console.log("bannerId", id);
    console.log("platform", platform);

    if (!platform) {
      return res.status(400).json({ message: "Platform is required" });
    }

    try {
      const banner = await Banner.findById(id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      if (!banner[`${platform.toLowerCase()}Fields`]) {
        return res
          .status(400)
          .json({ message: `No fields found for platform: ${platform}` });
      }
      let platformFields; // To hold platform-specific fields
      let adId; // To hold ad ID for the selected platform
      let accountId; // To hold account ID for the selected platform
      let isActive; // To hold current active status

      // Check platform and set corresponding fields
      if (platform === "Facebook") {
        platformFields = banner.facebookFields;
        adId = platformFields.adAccountId;
        accountId = platformFields.adAccountId;
        isActive = banner.instagramFields.isActive;
      } else if (platform === "YouTube") {
        platformFields = banner.youtubeFields;
        adId = platformFields.adIdYoutube;
        accountId = platformFields.AccountYoutubeId;
        isActive = banner.instagramFields.isActive;
      } else if (platform === "Instagram") {
        platformFields = banner.instagramFields;
        adId = platformFields.adIdInstagram;
        accountId = platformFields.adAccountIdInstagram;
        isActive = platformFields.isActive;
      } else {
        return res.status(400).json({ message: "Unsupported platform" });
      }

      // Validate platform-specific fields
      if (!adId || !accountId) {
        return res
          .status(400)
          .json({ message: `${platform} credentials are missing` });
      }

      // Determine new status (active or paused)
      const newStatus = isActive ? "PAUSED" : "ACTIVE";

      // Build API URL based on platform
      let url = "";
      let headers = {};

      if (platform === "Facebook") {
        // Facebook Ads API URL
        url = `https://graph.facebook.com/v17.0/${accountId}/ads`;
        headers = {
          Authorization: `Bearer ${platformFields.accessToken}`,
        };
      } else if (platform === "YouTube") {
        // YouTube Ads API URL (replace with the correct endpoint)
        url = `https://www.googleapis.com/youtube/v3/ads/${adId}`;
        headers = {
          Authorization: `Bearer ${process.env.YOUTUBE_ACCESS_TOKEN}`, // YouTube API Token
        };
      } else if (platform === "Instagram") {
        // Instagram Ads API URL (Instagram ads typically use Facebook's API)
        url = `https://graph.facebook.com/v17.0/${accountId}/ads`;
        headers = {
          Authorization: `Bearer ${platformFields.accessToken}`,
        };
      }

      // Call the appropriate API to toggle the ad status
      const response = await axios.post(
        url,
        { status: newStatus },
        { headers }
      );

      if (response.status !== 200) {
        return res
          .status(500)
          .json({ message: `Failed to update ad status on ${platform}` });
      }

      // Update the isActive field in the database
      if (platform === "Facebook" || platform === "Instagram") {
        banner.instagramFields.isActive = !isActive;
      } else if (platform === "YouTube") {
        banner.instagramFields.isActive = !isActive; // Update the isActive field for YouTube as well
      }

      await banner.save();

      res.status(200).json({
        message: `${platform} Banner ${
          !isActive ? "Activated" : "Deactivated"
        } successfully`,
      });
    } catch (error) {
      console.error("Error toggling ad status:", error);
      res
        .status(500)
        .json({ message: "An error occurred while toggling the ad status" });
    }
  };

  static async getAdMetrics(req, res) {
    // Replace these with your actual values
    const AD_OBJECT_ID = "1081487583201005";
    const ACCESS_TOKEN = "1081487583201005|E9zuVKUlAfnFkRuot0nQM9uMNIg";
    const metricsUrl = `https://graph.facebook.com/v21.0/${AD_OBJECT_ID}/ads`;
    try {
      const response = await axios.get(metricsUrl, {
        params: {
          fields: "id,name,status",
          access_token: ACCESS_TOKEN,
        },
      });
      const ads = response.data.data;

      if (ads.length === 0) {
        return res
          .status(404)
          .json({ message: "No ads found for this campaign." });
      }

      // Return the list of ads
      res.status(200).json(ads);
    } catch (error) {
      console.error("Failed to fetch ad metrics", error);
      res.status(500).json({ error: "Failed to fetch ad metrics" });
    }
  }

  static async sendSMS(req, res) {
    const { request_phone, message } = req.body;

    // Validate the input
    if (!request_phone || !message) {
      return res.status(400).json({
        success: false,
        error: "Phone number and message are required.",
      });
    }

    const url = "https://api.brevo.com/v3/transactionalSMS/sms";

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (response.ok) {
        res.json({ success: true, messageId: result.messageId });
      } else {
        console.error("Brevo API Error:", result);
        res.status(500).json({ success: false, error: result.message });
      }
    } catch (error) {
      console.error("Error sending SMS via Brevo:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async sendEmail(req, res) {
    const { request_email } = req.body; 
    console.log("Email:", request_email);

    // Validate email and message
    if (!request_email) {
      return res.status(400).json({
        success: false,
        error: "Email required.",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: request_email,
      subject: "Bienvenue sur Université X – Merci pour votre confiance !",
      html: `<!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 24px;
            color: #1d3557;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          ul {
            font-size: 16px;
            margin-left: 20px;
            list-style-type: disc;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            margin-top: 30px;
          }
          .footer a {
            color: #1d3557;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bienvenue sur Université X – Merci pour votre confiance !</h1>
          <p>Bonjour,</p>
          <p>Nous vous remercions de vous être inscrit sur <strong>Université X</strong> et de faire partie de notre communauté d'apprenants. Nous sommes ravis de vous accompagner tout au long de votre parcours académique.</p>
          <p>Voici quelques informations importantes pour vous aider à démarrer :</p>
          <ul>
            <li>Accédez à votre tableau de bord pour voir vos cours et gérer vos inscriptions.</li>
            <li>Commencez à explorer nos ressources et à prendre vos premiers cours en ligne.</li>
            <li>Restez connecté et informé grâce à notre newsletter hebdomadaire.</li>
          </ul>
          <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter à tout moment.</p>
          <p>Nous vous souhaitons une expérience enrichissante et pleine de succès sur <strong>Université</strong> !</p>
          <div class="footer">
            <p>À bientôt,<br/>L’équipe Université</p>
            <p><a href="https://www.universiteX.com">Visitez notre site web</a></p>
          </div>
        </div>
      </body>
    </html>`,
    };
    try {
      let info = await transporter.sendMail(mailOptions);
      return res.json({
        success: true,
        message: "Email sent successfully!",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to send email.",
      });
    }
  }
}

module.exports = BannerController;
