const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const {getUserByToken, getTokenFromHeaders, padStart} = require("../utils");

// POST /api/reviews
router.post('/', auth, async (req, res) => {
    try {
        const token = getTokenFromHeaders(req.headers);
        console.log({token});
        const user = await getUserByToken(token);
        console.log({user});
        const { rating, text, targetType, targetId } = req.body;
        const userId = user._id;
        const review = new Review({user: userId, rating, text, targetType, targetId });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reviews?targetType=Tobacco&targetId=123
router.get('/', async (req, res) => {
    const { targetType, targetId } = req.query;
    const reviews = await Review.find({ targetType, targetId })
        .populate('user', 'username')
        .sort({ createdAt: -1 });
    res.status(200).json(reviews.map(({_doc: item}) => {
        const date = new Date(item.createdAt);
        const day = date.getDate();
        const month = date.getMonth()+1;
        const year = date.getFullYear();
        return {
            ...item,
            // DD-MM-YYYY
            createdAt: `${padStart(day)}-${padStart(month)}-${year}`,
        }
    }));
});

module.exports = router;