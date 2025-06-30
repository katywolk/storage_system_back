const mongoose = require("mongoose");

const JarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String },
    description: { type: String },
    tobaccos: [
        {
            tobaccoId: { type: mongoose.Schema.Types.ObjectId, ref: "Tobacco" },
            percent: Number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Jar", JarSchema);