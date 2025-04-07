const mongoose = require('mongoose');

const panierSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit', // Reference to the Produit model
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantite: {
    type: Number,
    default: 1,
  },
  prixUnitaire: {
    type: Number,
    required: true,
  },
  tva: {
    type: Number,
    default: 20.00, // Default TVA (Tax) 20%
  },
  montantHT: {
    type: Number,
    required: true,
  },
  montantTVA: {
    type: Number,
    required: true,
  },
  montantTTC: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  marque: {
    type: String,
    required: true,
  },
});

const Panier = mongoose.model('Panier', panierSchema);

module.exports = Panier;
