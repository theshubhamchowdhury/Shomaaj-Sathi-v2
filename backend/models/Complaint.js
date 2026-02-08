const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageUrls: { type: [String], default: [] },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  wardNumber: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'solved'], default: 'pending' },
  solutionImageUrl: { type: String },
  resolutionNote: { type: String },
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
