const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getTokenFromHeaders(headers){
   return headers.authorization?.split(" ")[1];
}

async function getUserByToken(token){
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return User.findOne({  _id: decoded.id });
}

function padStart(value, targetLength = 2, padString = "0") {
     return value.toString().padStart(targetLength, padString)
}

function getRating(item) {
    return {
        ...item,
        reviews: undefined,
        rating: (parseFloat((item.reviews.reduce((acc, item) => acc + item.rating, 0) / item.reviews.length).toFixed(1))) || 0,
    }
}

module.exports = {
    getTokenFromHeaders,
    getUserByToken,
    padStart,
    getRating,
}