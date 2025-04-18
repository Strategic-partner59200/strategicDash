const Program = require("../Models/programSchema");
const Event = require("../Models/eventSchema");
const Command = require("../Models/commandSchema");
const Panier = require("../Models/panierSchema");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

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
      const commercialId = req.body.commercial;

      const { event_date, event_time, objective, comment } = req.body;
  
      const newEvent = new Event({
        admin: adminId,
        commercial: commercialId,
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
      // const events = await Event.find({ lead: id }).sort({ event_date: -1 });;
      const events = await Event.find({
        $or: [{ admin: id }, { commercial: id }, { lead: id }],
      }).sort({ event_date: -1 });
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
      command,
      email,
      panierId,
      phone,
      nom_societé,
      date,
      nom,
       siret,
       raissociale,
      address,
       numCommand,

        } = req.body;
        console.log("req.bodyyyyyyyyyyyyyyyyy", req.body)
         
    const panier = await Panier.findById(panierId);
    console.log("panier", panier)
    if (!panier) {
      return res.status(404).json({ message: "panier non trouvé" });
    }

    const newCommand = new Command({ admin: adminId, lead: leadId, commercial:commercialId,
        command_type, 
        command,
        date,
        panier: panierId,
        quantite: panier.quantite,
      prixUnitaire: panier.prixUnitaire,
      montantHT: panier.montantHT,
      montantTVA: panier.montantTVA,
      montantTTC: panier.montantTTC,
      code: panier.code,
      description: panier.description,
      tva: panier.tva,
        nom,
        email,
        siret,
        raissociale,
        address,
        phone,
        nom_societé,
        numCommand,
      });
      console.log("newCommands", newCommand)
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

  static async getAllsCommands (req, res) {
    const { id } = req.params;
  try {
    const commands = await Command.find({
      $or: [{ admin: id }, { commercial: id }],
    }).sort({ event_date: -1 });
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

static async sendDevisEmail(req, res) {
  try {
    const { email, pdf, commandNum, phone, clientName,
      societeName, code, description } = req.body;

   

    if (!email || !pdf) {
      return res.status(400).json({ message: 'Email and PDF are required.' });
    }

    // Extract base64 data and convert to Buffer
    const base64Data = pdf.split(';base64,').pop();
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Configure your email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or another SMTP provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Envoi de votre devis – ${code}`,
      html: `
        <p>Bonjour ${clientName},</p>
      
        <p>Comme convenu, vous trouverez ci-joint le devis correspondant à la prestation suivante : <strong>${description}</strong>.</p>
      
        <p>Ce devis détaille l’ensemble des prestations proposées ainsi que les conditions tarifaires. N’hésitez pas à me faire part de vos questions ou remarques si certains points nécessitent des précisions.</p>
      
        <p>Je reste bien entendu disponible pour en discuter ensemble.</p>
      
        <p>Dans l’attente de votre retour,<br/>
        Bien cordialement,</p>
      
        <p>${clientName}<br/>
        ${societeName}<br/>
        ${phone}<br/>
        ${email}</p>
      `,
      attachments: [
        {
          filename: `Devis-${commandNum}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Le devis a été envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l’envoi du devis :', error);
    res.status(500).json({ message: 'Erreur serveur lors de l’envoi du devis.' });
  }
}

static async sendFactureEmail(req, res) {
  try {
    const { email, pdf, commandNum, phone, societeName, montantTTC, description, code, montantHT, clientName, date } = req.body;

    // const formattedDate = new Date(date).toISOString().split('T')[0];
    const dueDate = new Date(date);
dueDate.setDate(dueDate.getDate() + 7);
const formattedDate = dueDate.toISOString().split('T')[0];

    if (!email || !pdf) {
      return res.status(400).json({ message: 'Email and PDF are required.' });
    }

    // Extract base64 data and convert to Buffer
    const base64Data = pdf.split(';base64,').pop();
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Configure your email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or another SMTP provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: ` Facture ${commandNum} – ${code}`,
      html: `
  <p>Bonjour ${clientName},</p>

  <p>Veuillez trouver ci-joint la facture correspondant à <strong>${description}</strong> réalisée pour <strong>${societeName || 'votre projet'}</strong>.</p>

  <p>Le montant total est de <strong>montant HT: ${montantHT}$ et montant TTC: ${montantTTC}$</strong>, avec une échéance de règlement au <strong>${formattedDate}</strong>.</p>

  <p>N’hésitez pas à me contacter si vous avez besoin d’informations complémentaires ou si vous souhaitez échanger à ce sujet.</p>

  <p>Merci encore pour votre confiance,<br/>
  Bien cordialement,</p>

  <p>${clientName}<br/>
  ${societeName}<br/>
  ${phone}<br/>
  ${email}</p>
`,
      attachments: [
        {
          filename: `Facture-${commandNum}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Le devis a été envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l’envoi du devis :', error);
    res.status(500).json({ message: 'Erreur serveur lors de l’envoi du devis.' });
  }
}


}

module.exports = ProgramController;
