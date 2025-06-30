const express = require("express");
const router = express.Router();
const Mix = require("../models/Mix");

// POST /api/mixes
router.post("/", async (req, res) => {
    try {
        const { title, description, tobaccos } = req.body;

        if (!title || !tobaccos || !Array.isArray(tobaccos)) {
            return res.status(400).json({ message: "Заполните все поля" });
        }

        const total = tobaccos.reduce((acc, t) => acc + Number(t.percent), 0);
        if (total !== 100) {
            return res.status(400).json({ message: "Сумма процентов должна быть ровно 100%" });
        }

        const newMix = new Mix({
            title,
            description,
            tobaccos,
            createdAt: new Date(),
        });

        const saved = await newMix.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("❌ Ошибка при создании микса:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// GET /api/mixes
router.get("/", async (req, res) => {
    try {
        const mixes = await Mix.find().populate("tobaccos.tobaccoId");
        res.json(mixes);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении миксов" });
    }
});

module.exports = router;