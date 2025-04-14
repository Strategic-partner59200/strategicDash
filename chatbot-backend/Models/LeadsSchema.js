const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: {
    name: { type: String, required: true }, // Ensure `name` is marked as required
  },
  addedAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      // required: true,
    },
    codepostal: {
      type: String,
    },
    address: {
      type: String,
    },
    ville: {
      type: String,
    },   
    email: {
      type: String,
      // required: true,
      match: /.+\@.+\..+/, // Basic email format validation
    },
    email1: {
      type: String,
      // required: true,
      match: /.+\@.+\..+/,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    prénom: {
      type: String,
      default: "",
    },
    besoin: {
      type: String,
      default: "",
    },
    demande: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    type: { type: String, default: "prospect" },
    verification_phone: { type: String, default: "" },
    verification_email: { type: String, default: "" },
    commentaires: [commentSchema],
    commercial: { type: mongoose.Schema.Types.ObjectId, ref: "Commercial" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   addedBy: {
//     name: { type: String, required: true }, // Ensure `name` is marked as required
//   },
//   addedAt: { type: Date, default: Date.now },
// });

// const chatSchema = new mongoose.Schema(
//   {
//     request_email: {
//       type: String,
//       // required: true,
//       match: /.+\@.+\..+/, // Basic email format validation
//     },
//     request_add_email: {
//       type: String,
//       // required: true,
//       match: /.+\@.+\..+/,
//     },
//     request_phone: {
//       type: String,
//       // required: true,
//     },
//     request_lastname: {
//       type: String,
//       default: "",
//     },
//     initial: {
//       type: String,
//       default: "",
//     },
//     information_request: {
//       type: String,
//       default: "",
//     },
//     logement: {
//       type: String,
//       default: "",
//     },
//     type_propriété: {
//       type: String,
//       default: "",
//     },
//     détails_logement: {
//       type: String,
//       default: "",
//     },
//     request_hot_water: {
//       type: String,
//       default: "",
//     },
//     request_heating_system: {
//       type: String,
//       default: "",
//     },
//     facture: {
//       type: String,
//       default: "",
//     },
//     request_departement: {
//       type: String,
//       default: "",
//     },
//     type: { type: String, default: "all" },
//     verification_phone: { type: String, default: "" },
//     verification_email: { type: String, default: "" },
//     commentaires: [commentSchema],
//     commercial: { type: mongoose.Schema.Types.ObjectId, ref: "Commercial" },
//     manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" },
//   },
//   { timestamps: true }
// );

// const Chat = mongoose.model("Chat", chatSchema);

// module.exports = Chat;
