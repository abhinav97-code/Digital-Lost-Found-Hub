const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: { type: String, enum: ['Lost', 'Found'], required: true },
    contact: { type: String, required: true }, // WhatsApp number ke liye
    image: String, // Photo ka rasta save karne ke liye
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);