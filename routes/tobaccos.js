const express = require("express");
const {ObjectId} = require('mongoose').Types;
const router = express.Router();
const Tobacco = require("../models/Tobacco");
const {createController} = require("../controllers/tobacco");
const {getRating} = require("../utils")
const {checkRoles, ROLE} = require("../middleware/checkRoles");


// POST /api/tobaccos
router.post("/", checkRoles(ROLE.ADMIN), createController);

router.get("/", async (req, res) => {
    try {
        const tobaccos = await Tobacco.aggregate([
            {
                $lookup: {
                    from: "reviews",         // колекция, к которой делаем JOIN
                    localField: "_id", // поле в orders
                    foreignField: "targetId",       // поле в customers
                    as: "reviews"        // куда сохранить результат JOIN
                }
            }
        ]).then((res) => {
            return res.map(getRating)
        });

        res.json(tobaccos);
    } catch (err) {
        console.error("Ошибка при получении списка табаков:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Пробуем привести к ObjectId, если это возможно
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Неверный формат ID" });
        }

        const tobacco = await Tobacco.aggregate([
            {
                $match: { _id: new ObjectId(id) }
            },
            {
                $lookup: {
                    from: "reviews",         // колекция, к которой делаем JOIN
                    localField: "_id", // поле в orders
                    foreignField: "targetId",       // поле в customers
                    as: "reviews"        // куда сохранить результат JOIN
                }
            }
        ])
            .then(res => res?.[0]);
        if (!tobacco) {
            return res.status(404).json({ message: "Табак не найден" });
        }

        res.json(getRating(tobacco));
    } catch (err) {
        console.error("Ошибка при получении табака:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Tobacco.findByIdAndUpdate(id, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Табак не найден" });
        }

        res.json(updated);
    } catch (err) {
        console.error("Ошибка при обновлении табака:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Получить все миксы
router.get("/mixes", async (req, res) => {
    try {
        const mixes = await Tobacco.find({ type: "mix" }).populate("tobaccos.tobaccoId");
        res.json(mixes);
    } catch (err) {
        console.error("Ошибка при получении миксов:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Получить один микс по ID
router.get("/mix/:id", async (req, res) => {
    try {
        const mix = await Tobacco.findOne({ _id: req.params.id, type: "mix" }).populate("tobaccos.tobaccoId");
        if (!mix) return res.status(404).json({ message: "Микс не найден" });
        res.json(mix);
    } catch (err) {
        console.error("Ошибка при получении микса:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Сохранение табака или микса (POST /api/tobaccos)
router.post("/", async (req, res) => {
    try {
        const { title, flavor, description, type, imageUrl, tobaccos } = req.body;

        const newItem = new Tobacco({
            title,
            flavor,
            description,
            type,
            imageUrl,
            createdAt: new Date(),
            tobaccos: Array.isArray(tobaccos) ? tobaccos : []
        });

        const saved = await newItem.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("Ошибка при создании табака или микса:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.delete("/:id", checkRoles(ROLE.ADMIN), async (req, res) => {
    try {
        const deleted = await Tobacco.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Табак не найден" });
        }
        res.json({ message: "Табак удалён" });
    } catch (err) {
        console.error("Ошибка при удалении табака:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;