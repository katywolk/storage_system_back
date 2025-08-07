const mongoose = require("mongoose");

const tobaccoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    flavor: { type: String, required: true },
    description: { type: String },
    type: { type: String, default: "tobacco" },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tobacco", tobaccoSchema);