const Chat = require("../Models/LeadsSchema");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

class DataController {
  
  static async data(req, res) {
    try {
      const data = new Chat(req.body);

      await data.save();

      res.status(201).json(data);
    } catch (error) {
      console.error("Error saving chat data:", error);
      res.status(500).json({ message: "Error saving chat data", error });
    }
  }

  // Retrieve chat data
  static async getdata(req, res) {
    try {
      // Retrieve all chat documents from the database
      const chatData = await Chat.find()
        .populate("commercial")
        .populate("manager");

      // Send the chat data back to the client
      res.status(200).json({ chatData });
    } catch (error) {
      console.error("Error retrieving chat data:", error);
      res.status(500).json({ message: "Error retrieving chat data", error });
    }
  }
  static async getdataById(req, res) {
    try {
      const { id } = req.params;
      const chat = await Chat.findById(id).populate("commercial");

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.status(200).json({ chat });
    } catch (error) {
      console.error("Error retrieving chat by ID:", error);
      res.status(500).json({ message: "Error retrieving chat by ID", error });
    }
  }
  static async updateDataById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
      const updatedData = req.body;

      const chat = await Chat.findByIdAndUpdate(id, updatedData, { new: true });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.status(200).json({ chat });
    } catch (error) {
      console.error("Error updating chat:", error);
      res.status(500).json({ message: "Error updating chat", error });
    }
  }

  static async addComment(req, res) {
    const { id } = req.params; // Lead ID
    const { text, name } = req.body;
    console.log("Adding comment to lead:", id, "Comment:", text, "User:", name);
    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required for the comment" });
    }

    try {
      // Trouver le lead par ID
      const lead = await Chat.findById(id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Vérifier ou initialiser les commentaires
      if (!lead.commentaires) {
        lead.commentaires = [];
      }

      // Ajouter un nouveau commentaire
      const newComment = {
        text,
        addedBy: { name },
        addedAt: new Date(),
      };
      // lead.commentaires.push(newComment);
      lead.commentaires.unshift(newComment);

      // Sauvegarder le lead avec le nouveau commentaire
      await lead.save();

      return res
        .status(200)
        .json({
          message: "Comment added successfully",
          commentaires: lead.commentaires,
        });
    } catch (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteDataById(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const chat = await Chat.findByIdAndDelete(id, updatedData, { new: true });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.status(200).json({ message: "Chat deleted successfully", chat });
    } catch (error) {
      console.error("Error deleting chat:", error);
      res.status(500).json({ message: "Error deleting chat", error });
    }
  }

  // static async searchData(req, res) {
  //   try {
  //     const { query, columnKey } = req.query;
  //     let filter = {};

  //     // Log to see the request params
  //     console.log("Received query:", query, "columnKey:", columnKey);

  //     if (!query || !columnKey) {
  //       return res
  //         .status(400)
  //         .json({ error: "Query and columnKey are required" });
  //     }
  //     if (columnKey === "createdAt") {
  //       // Convert the query to a Date object
  //       const dateQuery = new Date(query);
  //       if (!isNaN(dateQuery.getTime())) {
  //         // Search for documents created on that date (ignoring time)
  //         filter = {
  //           [columnKey]: {
  //             $gte: new Date(dateQuery.setHours(0, 0, 0, 0)), // Start of the day
  //             $lt: new Date(dateQuery.setHours(23, 59, 59, 999)), // End of the day
  //           },
  //         };
  //       } else {
  //         return res.status(400).json({ message: "Invalid date format." });
  //       }
  //     } else if (columnKey === "request_name") {
  //       filter = {
  //         $or: [
  //           { request_name: { $regex: query, $options: "i" } },
  //           { request_email: { $regex: query, $options: "i" } },
  //           { request_add_email: { $regex: query, $options: "i" } },
  //         ],
  //       };
  //     } else {
  //       // For other column keys, just search by the columnKey
  //       filter = { [columnKey]: { $regex: query, $options: "i" } };
  //     }
  //     // // Construct dynamic filter


  //     const results = await Chat.find(filter);

  //     res.status(200).json(results);
  //   } catch (error) {
  //     console.error("Error in search:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }
  // static async searchData(req, res) {
  //   try {
  //     const { query, columnKey } = req.query;
  
  //     console.log("Received query:", query, "columnKey:", columnKey);
  
  //     if (!query || !columnKey) {
  //       return res
  //         .status(400)
  //         .json({ error: "Query and columnKey are required" });
  //     }
  
  //     let filter = {};
  //     const fieldType = Chat.schema.paths[columnKey]?.instance;
  
  //     if (columnKey === "createdAt") {
  //       const dateQuery = new Date(query);
  //       if (!isNaN(dateQuery.getTime())) {
  //         filter = {
  //           [columnKey]: {
  //             $gte: new Date(dateQuery.setHours(0, 0, 0, 0)),
  //             $lt: new Date(dateQuery.setHours(23, 59, 59, 999)),
  //           },
  //         };
  //       } else {
  //         return res.status(400).json({ message: "Invalid date format." });
  //       }
  //     } else if (fieldType === "String") {
  //       if (columnKey === "request_name") {
  //         filter = {
  //           $or: [
  //             { request_name: { $regex: query, $options: "i" } },
  //             { request_email: { $regex: query, $options: "i" } },
  //             { request_add_email: { $regex: query, $options: "i" } },
  //           ],
  //         };
  //       } else {
  //         filter = { [columnKey]: { $regex: query, $options: "i" } };
  //       }
  //     } else {
  //       return res
  //         .status(400)
  //         .json({ message: `${columnKey} is not a valid searchable field.` });
  //     }
  
  //     console.log("Constructed filter:", filter);
  
  //     const results = await Chat.find(filter);
  //     res.status(200).json(results);
  //   } catch (error) {
  //     console.error("Error in search:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }


static async searchData(req, res) {
  try {
    const { query, columnKey } = req.query;

    if (!query || !columnKey) {
      return res.status(400).json({ error: "Query and columnKey are required" });
    }

    let filter = {};

    if (columnKey === "commercial") {
      // Populate the `commercial` field and search by its `nom` or `email`
      const results = await Chat.find()
        .populate({
          path: "commercial",
          match: {
            $or: [
              { prenom: { $regex: query, $options: "i" } },
              { nom: { $regex: query, $options: "i" } }
            ],
          },
        })
        .then((chats) => chats.filter((chat) => chat.commercial !== null)); // Filter out unmatched results

      return res.status(200).json(results);
    }

    const schemaPaths = Chat.schema.paths;

    if (!schemaPaths[columnKey]) {
      return res.status(400).json({ error: `Invalid columnKey: ${columnKey}` });
    }

    const fieldType = schemaPaths[columnKey].instance;

    if (fieldType === "String") {
      filter = { [columnKey]: { $regex: query, $options: "i" } };
    } else if (columnKey === "createdAt") {
      const dateQuery = new Date(query);
      if (!isNaN(dateQuery.getTime())) {
        filter = {
          [columnKey]: {
            $gte: new Date(dateQuery.setHours(0, 0, 0, 0)),
            $lt: new Date(dateQuery.setHours(23, 59, 59, 999)),
          },
        };
      } else {
        return res.status(400).json({ message: "Invalid date format." });
      }
    } else {
      return res.status(400).json({
        error: `Cannot apply regex to field ${columnKey} of type ${fieldType}`,
      });
    }

    const results = await Chat.find(filter);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

  
  static async updateStatusLead(req, res) {
    const { id } = req.params; // Get the lead's ID from the URL
    const { statusLead } = req.body; // Get the new statusLead from the request body

    // Validate the new status value
    const validStatuses = ["nouveau", "prospect", "client"]; // Define the valid statuses
    if (!validStatuses.includes(statusLead)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      // Find the lead by ID and update the 'type' field
      const updatedLead = await Chat.findByIdAndUpdate(
        id,
        { type: statusLead }, // Update the 'type' field
        { new: true } // Return the updated document
      );

      // If the lead is not found, return an error
      if (!updatedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      // Return the updated lead as a response
      res.status(200).json(updatedLead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    console.log("Deleting comment:", commentId, "from chat:", id);

    try {
      // Find the chat document by its ID
      const chat = await Chat.findById(id);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Find the index of the comment by its commentId
      const commentIndex = chat.commentaires.findIndex(
        (comment) => comment._id.toString() === commentId
      );

      console.log("Comment index:", commentIndex);

      if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Remove the comment from the `commentaires` array
      chat.commentaires.splice(commentIndex, 1);

      // Save the updated chat document
      await chat.save();

      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // static async importLeads(req, res) {
  //   const leads = req.body;

  //   try {
  //       console.log('Importing Leads', leads);

  //       // Get an array of all phone numbers from the incoming leads
  //       const leadPhones = leads.map(lead => lead.phone);

  //       // 1. Check if any of the phone numbers already exist in the database
  //       const existingLeads = await Chat.find({ phone: { $in: leadPhones } });

  //       // Extract duplicate phone numbers from the database
  //       const duplicatePhonesInDb = existingLeads.map(lead => lead.phone);
  //       console.log(`Duplicate phones found in database: ${duplicatePhonesInDb.join(', ')}`);

  //       // 2. Check for duplicate phone numbers within the imported data itself
  //       const phoneSet = new Set();
  //       const duplicateInImport = [];
  //       leads.forEach(lead => {
  //           if (phoneSet.has(lead.phone)) {
  //               duplicateInImport.push(lead.phone);
  //           } else {
  //               phoneSet.add(lead.phone);
  //           }
  //       });

  //       console.log(`Duplicate phones found in imported data: ${duplicateInImport.join(', ')}`);

  //       // 3. Combine duplicates from both the database and imported data
  //       const allDuplicates = [...duplicatePhonesInDb, ...duplicateInImport];
  //       const uniqueLeads = leads.filter(lead => !allDuplicates.includes(lead.phone));

  //       if (uniqueLeads.length === 0) {
  //           return res.status(400).json({
  //               message: 'All leads have duplicate phone numbers and were not imported.',
  //               duplicatePhones: allDuplicates
  //           });
  //       }

  //       const importedLeads = await Promise.all(
  //           uniqueLeads.map(async (coach) => {
  //               const newLead = new Chat(coach);
  //               return await newLead.save();
  //           })
  //       );

  //       console.log('Imported leads:', importedLeads);
  //       res.status(200).json(importedLeads);

  //   } catch (error) {
  //       console.error('Error importing leads:', error.message);
  //       res.status(500).json({ message: 'Error importing leads', error });
  //   }
  // }
  static async importLeads(req, res) {
    const leads = req.body;

    if (!Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({ message: 'No leads provided for import' });
    }

    try {
        // Step 1: Validate all leads have required fields
        const invalidLeads = leads.filter(lead => !lead.phone);
        if (invalidLeads.length > 0) {
            return res.status(400).json({
                message: `${invalidLeads.length} leads are missing phone numbers`,
                invalidLeads
            });
        }

        // Step 2: Check for duplicates in the import batch
        const phoneSet = new Set();
        const duplicatePhonesInImport = [];
        
        leads.forEach(lead => {
            if (phoneSet.has(lead.phone)) {
                duplicatePhonesInImport.push(lead.phone);
            } else {
                phoneSet.add(lead.phone);
            }
        });

        if (duplicatePhonesInImport.length > 0) {
            return res.status(400).json({
                message: 'Duplicate phone numbers found in import file',
                duplicatePhones: [...new Set(duplicatePhonesInImport)] // Unique duplicates
            });
        }

        // Step 3: Check for existing phones in database
        const existingPhones = await Chat.find({ 
            phone: { $in: leads.map(l => l.phone) } 
        }).select('phone -_id').lean();

        if (existingPhones.length > 0) {
            const existingPhoneNumbers = existingPhones.map(l => l.phone);
            return res.status(400).json({
                message: 'Some phone numbers already exist in database',
                duplicatePhones: existingPhoneNumbers
            });
        }

        // Step 4: Import with transaction for atomicity
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const importedLeads = await Chat.insertMany(leads, { session });
            await session.commitTransaction();
            
            return res.status(200).json({
                message: 'Leads imported successfully',
                count: importedLeads.length,
                leads: importedLeads
            });
        } catch (insertError) {
            await session.abortTransaction();
            throw insertError;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Error importing leads:', error.message);
        
        if (error.code === 11000) { // MongoDB duplicate key error
            const duplicateKey = error.keyValue?.phone || 'unknown';
            return res.status(400).json({
                message: `Duplicate phone number found: ${duplicateKey}`,
                error: 'DUPLICATE_KEY'
            });
        }
        
        return res.status(500).json({ 
            message: 'Error importing leads',
            error: error.message 
        });
    }
}

static async createEmailing(req, res) {
  
  const { email, nom} = req.body;

 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Automatisez votre acquisition avec l’IA',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 700px; margin: auto;">
       <img 
  src="https://strategicdash.onrender.com/static/logo.jpeg" 
  alt="Logo" 
  style="width: 80px; height: auto; display: block; margin-bottom: 20px;" 
/>
    
        <p>Bonjour ${nom},</p>
    
        <p>
          Chez <strong>Strategic Partner</strong>, nous aidons les professionnels à obtenir des <strong>rendez-vous ultra qualifiés</strong> grâce à des <strong>infrastructures d’acquisition automatisées, propulsées par l’IA</strong>.
        </p>
    
        <p>
          <strong>Fini la prospection manuelle</strong> : notre système travaille pour vous, <strong>24h/24, 7j/7</strong>, pour attirer, qualifier et convertir vos prospects.
        </p>
    
        <ul>
          <li>Vous gagnez du temps</li>
          <li>Vous signez plus</li>
          <li>Vous développez avec une structure prévisible</li>
        </ul>
    
        <p>
          Nos clients <strong>ne cherchent plus de clients</strong> — ce sont les clients qui viennent à eux.
        </p>
    
        <p>
          Si vous voulez la même chose, <strong>répondez à ce mail</strong> et on en parle.
        </p>
    
        <p style="margin-top: 40px;">
          Cordialement,<br />
          <br />
          Strategic partner<br />
          <a href="mailto:strategic.partnerfrance@gmail.com">strategic.partnerfrance@gmail.com</a> - +33 6 10 08 33 86<br />
          99c boulevard Constantin Descat,<br />59200 Tourcoing, France
        </p>
      </div>
    `,
  };
  
  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
}

static async createEmailingR(req, res) {
  const { email, nom, heure, jour, lien } = req.body;
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Confirmation de votre rendez-vous avec Strategic Partner',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 700px; margin: auto;">
        <img 
          src="https://strategicdash.onrender.com/static/logo.jpeg" 
          alt="Strategic Partner Logo" 
          style="width: 100px; height: auto; display: block; margin: 0 auto 30px auto;" 
        />
    
        <p>Bonjour ${nom},</p>
    
        <p>
          Merci pour votre prise de rendez-vous avec <strong>Strategic Partner</strong> – c’est confirmé !<br />
          Nous nous retrouverons le <strong>${jour}</strong> à <strong>${heure}</strong> pour faire le point sur votre stratégie d’acquisition 
          et explorer comment l’IA peut vous apporter plus de clients… automatiquement.
        </p>
    
        <p style="font-weight: bold; margin-top: 30px;">🔎 Au programme :</p>
        <ul style="padding-left: 20px; margin-top: 10px;">
          <li>Analyse de votre système actuel</li>
          <li>Identification des points de friction</li>
          <li>Présentation de notre infrastructure d’acquisition automatisée</li>
          <li>Plan d’action concret pour générer des rendez-vous ultra qualifiés</li>
        </ul>
    
        <p style="margin-top: 30px;">
          👉 <strong>Le lien de notre appel :</strong><br />
          <a href="${lien}" style="color: #1a73e8; text-decoration: none;">${lien}</a>
        </p>
    
        <p style="margin-top: 30px;">
          D’ici là, n’hésitez pas à nous répondre si vous avez la moindre question.
        </p>
    
        <p style="margin-top: 40px;">
          À très vite,<br /><br />
          ${nom}<br />
          Fondateur – Strategic Partner
        </p>
    
        <hr style="margin: 40px 0;" />
    
        <p style="font-size: 14px; color: #777;">
          Strategic Partner<br />
          <a href="mailto:strategic.partnerfrance@gmail.com" style="color: #777; text-decoration: none;">
            strategic.partnerfrance@gmail.com
          </a> - +33 6 10 08 33 86<br />
          99c boulevard Constantin Descat, 59200 Tourcoing, France
        </p>
      </div>
    `
  };
  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
    
}
static async createEmailingC(req, res) {
  const { email, nom, offre,
    montant,
    date,
    reference, } = req.body;


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Confirmation de votre commande – Strategic Partner',
    html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 700px; margin: auto;">
    <img 
      src="https://strategicdash.onrender.com/static/logo.jpeg" 
      alt="Strategic Partner Logo" 
      style="width: 100px; height: auto; display: block; margin: 0 auto 30px auto;" 
    />

    <p>Bonjour ${nom},</p>

    <p>
      Merci pour votre confiance et <strong>bienvenue chez Strategic Partner</strong> !<br />
      Nous vous confirmons que votre commande a bien été reçue et est maintenant en cours de traitement.
    </p>

    <p style="font-weight: bold; margin-top: 30px;">🔧 Prochaine étape :</p>
    <p>
      Notre équipe va vous contacter sous <strong>24h</strong> pour lancer l'onboarding et commencer 
      la mise en place de votre <strong>infrastructure d'acquisition automatisée</strong>.
    </p>

    <p style="font-weight: bold; margin-top: 30px;">📦 Détail de votre commande :</p>
    <ul style="padding-left: 20px; margin-top: 10px;">
      <li><strong>Offre :</strong> ${offre}</li>
      <li><strong>Montant :</strong> ${montant}</li>
      <li><strong>Date de commande :</strong> ${date}</li>
      <li><strong>Référence :</strong> ${reference}</li>
    </ul>

    <p style="margin-top: 30px;">
      Nous sommes impatients de vous accompagner vers une acquisition plus simple, plus intelligente… 
      et surtout <strong>plus rentable</strong>.
    </p>

    <p style="margin-top: 40px;">
      À très vite,<br /><br />
      ${nom}<br />
      Fondateur – Strategic Partner
    </p>

    <hr style="margin: 40px 0;" />

    <p style="font-size: 14px; color: #777;">
      Strategic Partner<br />
      <a href="mailto:strategic.partnerfrance@gmail.com" style="color: #777; text-decoration: none;">
        strategic.partnerfrance@gmail.com
      </a> - +33 6 10 08 33 86<br />
      99c boulevard Constantin Descat, 59200 Tourcoing, France
    </p>
  </div>
`
  };
  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
}

}
  

module.exports = DataController;
