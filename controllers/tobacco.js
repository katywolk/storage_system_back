const {create} = require('../modules/tobacco');

async function createController(req, res)  {
    try {
        const { title, flavor, description, type } = req.body;

        if (!title || !flavor) {
            return res.status(400).json({ message: "Заполните все обязательные поля" });
        }

        const newTobacco = await create({title, flavor, description});

        res.status(201).json({ message: "Табак добавлен", tobacco: newTobacco });

    } catch (err) {
        console.error("Ошибка при создании табака:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
}

module.exports = {
    createController,
};