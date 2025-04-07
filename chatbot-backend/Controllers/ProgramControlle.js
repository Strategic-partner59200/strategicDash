const Program = require("../Models/programSchema");
const Event = require("../Models/eventSchema");
const Command = require("../Models/commandSchema");
const mongoose = require("mongoose");

class ProgramController {
  static async createProgram(req, res) {
    try {
        const { title, mainText, imageUrl, userId } = req.body;
        if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
      }
        const newProgram = new Program({ title, mainText, imageUrl, userId });
        await newProgram.save();
        res.status(201).json(newProgram);
      } catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ message: 'Failed to create program.' });
      }
  }

  static async getAllPrograms(req, res) {
    try {
        const programs = await Program.find(); 
        res.status(200).json(programs);
      } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ message: 'Failed to fetch programs.' });
      }
  }

  static async getProgramById(req, res) {
    try {
        const { id } = req.params;
        const program = await Program.findById(id);
        if (!program) {
          return res.status(404).json({ message: 'Program not found.' });
        }
        res.status(200).json(program);
      } catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({ message: 'Failed to fetch program.' });
      }
  }

  static async updateProgramById(req, res) {
    try {
        const { id } = req.params;
        const { title, mainText, imageUrl, userId } = req.body;
        const updatedProgram = await Program.findByIdAndUpdate(
          id,
          { title, mainText, imageUrl, userId },
          { new: true }
        );
        res.status(200).json(updatedProgram);
      } catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({ message: 'Failed to update program.' });
      }
    };
  

  static async deleteProgramById(req, res) {
    try {
        const { id } = req.params;
        await Program.findByIdAndDelete(id);
        res.status(200).json({ message: 'Program deleted successfully.' });
      } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ message: 'Failed to delete program.' });
      }
  }

  static async createEvent(req, res) {
    try {
      const adminId = req.body.admin; 
      const leadId = req.body.leadId;

      const { event_date, event_time, objective, comment } = req.body;
  
      const newEvent = new Event({
        admin: adminId,
        event_date,
        event_time,
        objective,
        comment,
        lead: leadId
      });
  
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      console.error("Error saving event:", error);
      res.status(500).json({ message: "Error saving event", error });
    }
  }
  static async getAllEvents(req, res) {
    const { id } = req.params; // Get leadId from query parameter
  
    try {
      const events = await Event.find({ lead: id }).sort({ event_date: -1 });;
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events", error });
    }
  }
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await Event.findByIdAndDelete(id);
      res.status(200).json({ message: "Event deleted successfully." });
    }
    catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event." });
    }
  }

 static async createCommand(req, res) {
  try {
    const adminId = req.body.admin; 
    const leadId = req.body.leadId;
    const commercialId = req.body.commercial;
    const { 
      command_type,
      description,
      prixUnitaire,
      quantite,
      totalHT,
      totalTVA,
      totalTTC,
      date,
      request_lastname,
       request_email,
       request_phone,
       siret,
       codepostal,
       raissociale,
       ville,
       adresse,
       numCommand,
        code,
        marque
        } = req.body;

    const newCommand = new Command({ admin: adminId, lead: leadId, commercial:commercialId,
        command_type, 
        date,
        description,
        prixUnitaire,
        quantite,
        totalHT,
        totalTVA,
        totalTTC,
        request_lastname,
        request_email,
        request_phone,
        siret,
        codepostal,
        raissociale,
        ville,
        adresse,
        numCommand,
        code,
        marque
      });
    await newCommand.save();

    res.status(201).json(newCommand);
  } catch (error) {
    console.error("Error creating command:", error);
    res.status(500).json({ message: "Error creating command", error });
  }
 }
 static async getAllCommands (req, res) {
  const { id } = req.params; // Get leadId from query parameter
  try {

    const commands = await Command.find({ lead: id }).sort({ createdAt: -1 });;


    res.status(200).json(commands);
  } catch (error) {
    console.error("Error fetching commands:", error);
    res.status(500).json({ message: "Error fetching commands", error });
  }
 }

 static async getCommandById (req, res) {
  const { id } = req.params;

  try {
  

    // Convert string ID to ObjectId explicitly
    const com = await Command.findById(new mongoose.Types.ObjectId(id));

    if (!com) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }
    res.status(200).json(com); // Return the product (not an array)
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    res.status(500).json({ message: "Échec de la récupération du produit." });
  }
 }


static async validateCommand (req, res) {
const { id } = req.params;
  


  try {
    // Fetch the existing command
    const command = await Command.findById(id);
    if (!command) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }


    // Update the command in the database with the new fields
    const updatedCommand = await Command.findByIdAndUpdate(
      id,
      {
        command_type: req.body.command_type,
        numCommand: req.body.numCommand, // Ensure this is updated
        // You can add other fields as needed from the request body
      },
      { new: true, runValidators: true }
    );
    


    if (!updatedCommand) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json(updatedCommand);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
}

 static async deleteCommandById(req, res) {
  const { id } = req.params;

  try {
    const deletedCommand = await Command.findByIdAndDelete(id);

    if (!deletedCommand) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json({ message: 'Commande supprimée avec succès', deletedCommand });
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de la commande", error });
  }
}

 static async updateCommandById(req, res) {
  const { id } = req.params;
  const updateFields = req.body;
  console.log("updateFields", updateFields)

  try {
    const updatedCommand = await Command.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedCommand) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json(updatedCommand);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
}



}

module.exports = ProgramController;
