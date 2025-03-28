const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", 
      required: true,
    },
    command_type: {
      type: String,
      enum: ["devis", "commande"], // Changed "contract" to "commande" to match the form
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
      min: 0, // Ensures that the price must be a positive number
    },
    note: {
      type: String,
      required: false,
    },
    TVA: {
      type: Number,
      default: 20, // Fixed TVA value as per your form
    },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Command", commandSchema);
