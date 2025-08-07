const { getUserByToken, getTokenFromHeaders } = require("../utils");

const ROLE = {
    ADMIN: "admin",
    USER: "user"
}

const checkRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        const token = getTokenFromHeaders(req.headers);
        if (!token) {
            res.status(401).json({ message: "Нет токена" });
            return;
        }

        try {
            const user = await getUserByToken(token);

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