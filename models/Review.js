const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String },
    targetType: { type: String, enum: ['Tobacco', 'Mix'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);