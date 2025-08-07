const Tobacco = require("../models/Tobacco");

async function create({title, flavor, description}) {
    const newTobacco = new Tobacco({
        title,
        flavor,
        description,
        createdAt: new Date()
    });

    await newTobacco.save();

    return newTobacco;
}

module.exports = {
    create,
};