const mongoose = require("mongoose");

const CommandeSchema = new mongoose.Schema({
  command: {
    type: String,
    required: true,
    default: 'devis' // Default value if not provided
  },
  command_type: { type: String, enum: ["commande", "devis"], required: true },
  date: { type: Date, required: true },
  nom: String,
  // request_email: String,
  // request_phone: String,
  siret: String,
  // codepostal: String,
  raissociale: String,
  // ville: String,
  // adresse: String,
  description: String,
  numCommand: {
    type: String,
    required: true,
  },
code: String, 
// marque: String, 
  TVA: {
    type: Number,
  },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
  totalHT: {
    type: Number,
  },
  
  totalTTC: {
    type: Number,
  },
  totalTVA: {
    type: Number,
  },
  quantite: {
    type: Number,
  },

  commercial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commercial", // Referring to the Commercial model
    required: false, // If this is optional, you can make it not required
  },
});


module.exports = mongoose.model("Commande", CommandeSchema);
