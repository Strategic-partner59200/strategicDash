const leadSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    capturedAt: { type: Date, default: Date.now },
    // Additional fields (e.g., status, follow-up notes)
  });
  
  const Lead = mongoose.model('Lead', leadSchema);
  module.exports = Lead;
  