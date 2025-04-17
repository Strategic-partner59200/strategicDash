const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  prixVente: {
    type: Number,
    required: true,
  },
  tva: {
    type: Number,
    default: 20.00,
  },
  quantite: {
    type: Number,
    default: 1,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
  commercial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commercial", // Referring to the Commercial model
    required: false, // If this is optional, you can make it not required
  },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, 
}, {
  timestamps: true,
});

const Produit = mongoose.model('Produit', produitSchema);
module.exports = Produit;
