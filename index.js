require("dotenv").config();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");

const {checkRoles, ROLE} = require("./middleware/checkRoles");

const authRoutes = require("./routes/auth");
const tobaccosRoutes = require("./routes/tobaccos");
const itemRoutes = require("./routes/jar");
const mixes = require("./routes/mixes");
const reviewRoutes = require("./routes/reviews");

const app = express();
const uri = process.env.MONGO_URI;

app.use(express.json());
app.use(cors({
    origin: [
        `http://localhost:${process.env.FRONTEND_PORT}`, // Front-end without port
        `http://localhost:${process.env.BACKEND_PORT}`, // Back-end without port
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
app.use('/api/reviews', reviewRoutes);

app.disable('x-powered-by');



app.use(cookieParser());


// 🔐 Только для админов
app.get("/api/admin", checkRoles(ROLE.ADMIN), (req, res) => {
    res.json({ message: "Панель администратора" });
});

// ✍️ Для user и admin — добавление комментариев
app.post("/api/comment", checkRoles(ROLE.ADMIN, ROLE.USER), (req, res) => {
    res.json({ message: "Комментарий добавлен" });
});

// 📖 Для всех — доступ к контенту
app.get("/api/content", (req, res) => {
    res.json({ message: "Контент доступен всем" });
});

// Подключение к MongoDB
mongoose
    .connect(uri)
    .then(() => {
        console.log("✅ Подключено к MongoDB");
        app.listen(3001, '0.0.0.0',() =>
            console.log(`🚀 Сервер запущен на http://0.0.0.0:${3001}`)
        );
    })
    .catch((err) => {
        console.error("❌ Ошибка MongoDB:", err);
        process.exit(1); // останавливаем процесс, если не удалось подключиться
    });

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

