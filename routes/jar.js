const express = require("express");
const router = express.Router();
const Jar = require("../models/Jar");

// Получить конкретную банку
router.get("/jar/:id", async (req, res) => {
    try {
        const jar = await Jar.findById(req.params.id).populate("tobaccos.tobaccoId");
        if (!jar) return res.status(404).json({ message: "Объект не найден" });
        res.json(jar);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// Получить все банки
router.get("/jars", async (req, res) => {
    try {
        const jars = await Jar.find()
            .sort({ createdAt: -1 })
            .populate("tobaccos.tobaccoId");

        res.json(jars);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// Создать новую банку с авто-нумерацией
router.post("/jars", async (req, res) => {
    try {
        const count = await Jar.countDocuments();
        const title = `Банка №${count + 1}`;

        const newJar = new Jar({
            title,
            imageUrl: req.body.imageUrl || "",
            description: req.body.description || ""
        });

        await newJar.save();
        res.status(201).json(newJar);
    } catch (err) {
        console.error("Ошибка при создании банки:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Положить табак в банку (заменяет текущий)
router.post("/jars/:jarId/add", async (req, res) => {
    try {
        const { jarId } = req.params;
        const { tobaccoId } = req.body;

        if (!tobaccoId) {
            return res.status(400).json({ message: "tobaccoId обязателен" });
        }

        const jar = await Jar.findById(jarId);
        if (!jar) {
            return res.status(404).json({ message: "Банка не найдена" });
        }

        // Удаляем старый табак и добавляем новый
        jar.tobaccos = [{ tobaccoId }];
        await jar.save();

        res.status(200).json({ message: "Табак обновлён в банке", jar });
    } catch (err) {
        console.error("Ошибка при обновлении табака в банке:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Удалить табак из банки
router.delete("/jars/:jarId/tobacco", async (req, res) => {
    try {
        const { jarId } = req.params;

        const jar = await Jar.findById(jarId);
        if (!jar) {
            return res.status(404).json({ message: "Банка не найдена" });
        }

        jar.tobaccos = [];
        await jar.save();

        res.json({ message: "Табак удалён из банки", jar });
    } catch (err) {
        console.error("Ошибка при удалении табака:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;