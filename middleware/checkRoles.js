const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ROLE = {
    ADMIN: "admin",
    USER: "user"
}

const checkRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Нет токена" });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ id: decoded.id});

            if (!allowedRoles.includes(user.role)) {
                res.status(403).json({ message: "Недостаточно прав" });
                return;
            }
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ message: "Токен недействителен" });
            return;
        }
    };
};

module.exports = {
    ROLE,
    checkRoles,
};