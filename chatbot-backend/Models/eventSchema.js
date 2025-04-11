const mongoose = require('mongoose');

// Event Schema for Calendar
const eventSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", 
        // required: true,
      },
      commercial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commercial",
        // required: true,
      },
  event_date: { type: String, required: true }, // Store the date in YYYY-MM-DD format
  event_time: { type: String, required: true }, // Store the time as HH:mm
  objective: { type: String, required: true },
  comment: { type: String, required: false },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
