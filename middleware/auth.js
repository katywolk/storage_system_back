const jwt = require("jsonwebtoken");
const SECRET_KEY = "секретный_ключ";

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Нет токена" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Недействительный токен" });
        req.user = user;
        next();
    });
};
const authMiddleware = require("./auth");

app.get("/api/secret-data", authMiddleware, (req, res) => {
    res.json({ message: "Это защищённые данные", user: req.user });
});

const token = localStorage.getItem("token");

const response = await fetch("http://localhost:3001/api/secret-data", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

module.exports = authenticateToken;