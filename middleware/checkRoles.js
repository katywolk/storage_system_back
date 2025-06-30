const jwt = require("jsonwebtoken");

const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Нет токена" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!allowedRoles.includes(decoded.role)) {
                console.log();
                return res.status(403).json({ message: "Недостаточно прав" });
            }
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Токен недействителен" });
        }
    };
};

module.exports = checkRoles;