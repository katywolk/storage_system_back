const mongoose = require("mongoose");

const mixSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    tobaccos: [
        {
            tobaccoId: { type: mongoose.Schema.Types.ObjectId, ref: "Tobacco", required: true },
            percent: { type: Number, required: true },
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mix", mixSchema);