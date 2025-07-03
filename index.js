require("dotenv").config();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");

const checkRoles = require("./middleware/checkRoles");

const authRoutes = require("./routes/auth");
const tobaccosRoutes = require("./routes/tobaccos");
const itemRoutes = require("./routes/jar");
const mixes = require("./routes/mixes");


const app = express();
app.use(express.json());

const port = process.env.BACKEND_PORT;
const uri = process.env.MONGO_URI;



app.use(cors({
    origin: [
        `http://${process.env.HOST_IP}`, // Front-end without port
        `http://${process.env.HOST_IP}:${process.env.FRONTEND_PORT}`, // Front-end port
        `http://${process.env.HOST_IP}:${process.env.BACKEND_PORT}`, // Back-end port
    ],
    credentials: true,
}));

app.use("/api/tobaccos", tobaccosRoutes); // подключение маршрутов
app.use("/api/mixes", mixes);
app.use("/api", itemRoutes);
app.use("/api", authRoutes);


app.use(cookieParser());


// 🔐 Только для админов
app.get("/api/admin", checkRoles("admin"), (req, res) => {
    res.json({ message: "Панель администратора" });
});

// ✍️ Для user и admin — добавление комментариев
app.post("/api/comment", checkRoles("user", "admin"), (req, res) => {
    res.json({ message: "Комментарий добавлен" });
});

// 📖 Для всех — доступ к контенту
app.get("/api/content", checkRoles("reader", "user", "admin"), (req, res) => {
    res.json({ message: "Контент доступен всем" });
});

// Подключение к MongoDB
mongoose
    .connect(uri)
    .then(() => console.log("✅ Подключено к MongoDB"))
    .catch((err) => console.error("❌ Ошибка MongoDB:", err));

// Роуты

// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });



app.get("/api/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Нет токена" });

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: "Доступ разрешён", user: decoded });
    } catch {
        res.status(401).json({ message: "Токен недействителен" });
    }
});

app.listen(port, '0.0.0.0',() =>
    console.log(`🚀 Сервер запущен на http://0.0.0.0:${port}`)
);