const Panier = require("../Models/panierSchema");
const Produit = require("../Models/produitSchema"); // Assuming you have a Produit model

class PanierController {
  static async createPanier(req, res) {
    try {
      let leadId = req.body.leadId;
      const { produitId, quantite, admin, commercial } = req.body;
      console.log("req.bodyzzzzzzzzzzzz", req.body);

      const userId = admin || commercial;
      if (!userId) {
        return res.status(400).json({ message: "Admin or Commercial ID must be provided." });
      }
  
      // Find the product by ID
      const produit = await Produit.findById(produitId);
      if (!produit) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      // Ensure the product price and TVA are numbers
      const prixVente = parseFloat(produit.prixVente);
      const tva = parseFloat(produit.tva);

      if (isNaN(prixVente) || isNaN(tva)) {
        return res
          .status(400)
          .json({ message: "Invalid product price or TVA value" });
      }

      // Calculate Montant HT, TVA, and TTC
      const montantHT = prixVente * quantite;
      const montantTVA = (montantHT * tva) / 100;
      const montantTTC = montantHT + montantTVA;

      if (isNaN(montantHT) || isNaN(montantTVA) || isNaN(montantTTC)) {
        return res.status(400).json({ message: "Invalid amount calculation" });
      }

      // Check if the product already exists in the panier
      const existingPanierItem = await Panier.findOne({ produit: produitId });
      if (existingPanierItem) {
        // If the product exists, update the quantity and recalculate
        // existingPanierItem.quantite = quantite;
        existingPanierItem.quantite += 1;
        leadId = existingPanierItem.lead;
        existingPanierItem.admin = admin ? admin : undefined;
        existingPanierItem.commercial = commercial ? commercial : undefined;
        existingPanierItem.montantHT = existingPanierItem.quantite * prixVente;
        existingPanierItem.montantTVA =
          (existingPanierItem.montantHT * tva) / 100;
        existingPanierItem.montantTTC =
          existingPanierItem.montantHT + existingPanierItem.montantTVA;

        await existingPanierItem.save();
        return res.status(200).json(existingPanierItem);
      }
      console.log("leadIdsssssssss", leadId);

      // If not, create a new panier item
      const panier = new Panier({
        lead: leadId,
        admin: admin ? admin : undefined,
        commercial: commercial ? commercial : undefined,
        produit: produitId,
        description: produit.description,
        code: produit.code,
        // marque: produit.marque,
        quantite: quantite,
        prixUnitaire: prixVente,
        tva: tva,
        montantHT: montantHT,
        montantTVA: montantTVA,
        montantTTC: montantTTC,
      });
      console.log("panier", panier);

      // Save the new cart item
      await panier.save();
      res.status(201).json(panier);
    } catch (error) {
      console.error("Error adding to panier:", error);
      res.status(500).json({ message: "Failed to add product to panier" });
    }
  }

  static async getPannierById(req, res) {
    const { panierId } = req.params;
    console.log("panierId", panierId);

  try {
    const items = await Panier.findById(panierId); // if you want one panier

    console.log("items", items);

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No items found for this panier.' });
    }

    res.json(items);
  } catch (error) {
    console.error('Error fetching panier items:', error);
    res.status(500).json({ message: 'Server error while fetching panier items.' });
  }
  }

  static async getPanierById(req, res) {
    const { id } = req.params;
    try {
      const panierItems = await Panier.find({ lead: id }).populate(
        "produit",
        "description prixVente tva"
      );
      res.status(200).json(panierItems);
    } catch (error) {
      console.error("Error fetching panier:", error);
      res.status(500).json({ message: "Failed to fetch panier" });
    }
  }

  static async getAllPanier(req, res) {
    try {
      const paniers = await Panier.find().populate(
        "produit",
        "description prixVente tva"
      );
      res.status(200).json(paniers);
    } catch (error) {
      console.error("Error fetching all paniers:", error);
      res.status(500).json({ message: "Failed to fetch all paniers" });
    }
  }
  static async deletePanierById(req, res) {
    try {
      const { panierId } = req.params; // Get panierId from URL parameter (this is _id)


      // Use findByIdAndDelete instead of remove
      const result = await Panier.findByIdAndDelete(panierId);

      if (!result) {
        return res.status(404).json({ message: "Panier item not found" });
      }

      return res.status(200).json({ message: "Produit removed from panier" });
    } catch (error) {
      console.error("Error deleting panier item:", error);
      return res.status(500).json({ message: "Failed to remove panier item" });
    }
  }

  // Assuming the frontend sends a request to set quantity to 0
  static async updatePanierItem(req, res) {
    try {
      const { panierId } = req.params;
      const { quantite } = req.body; // New quantity (can be 0)
  

      const panierItem = await Panier.findById(panierId);

      if (!panierItem) {
        return res.status(404).json({ message: "Item not found in panier" });
      }

      panierItem.quantite = quantite; // Set the quantity to 0 (or whatever value)
      panierItem.montantHT = panierItem.quantite * panierItem.prixUnitaire;
      panierItem.montantTVA = (panierItem.montantHT * panierItem.tva) / 100;
      panierItem.montantTTC = panierItem.montantHT + panierItem.montantTVA;

      await panierItem.save();
      res.status(200).json(panierItem);
    } catch (error) {
      console.error("Error updating panier item:", error);
      res.status(500).json({ message: "Failed to update panier item" });
    }
  }
}

module.exports = PanierController;
