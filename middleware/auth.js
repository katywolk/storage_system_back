const jwt = require("jsonwebtoken");
const {getTokenFromHeaders} = require("../utils");

const authenticateToken = (req, res, next) => {
    const token = getTokenFromHeaders(req.headers);
    if (!token) return res.status(401).json({ message: "Нет токена" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Недействительный токен" });
        // todo пойти в бд найти пользователя
        next();
    });
};

module.exports = authenticateToken;