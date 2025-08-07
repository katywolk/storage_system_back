const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

console.log("Auth routes loaded");


// Регистрация
router.post("/register", async (req, res) => {
    const { email, password, username } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
        res.status(400).json({ message: "Email уже используется" });
        return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        password: hashed,
        role: "user",
        username,
    });

    res.status(201).json({ message: "Пользователь зарегистрирован" });
});

// Вход
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Неверный пароль" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token, user: {
            id: user._id,
            email: user.email,
            role: user.role
        } });
});

module.exports = router;