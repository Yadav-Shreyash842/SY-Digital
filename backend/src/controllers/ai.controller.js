const { chatWithAI } = require("../services/ai.service");
const ApiResponse = require("../utils/ApiResponse");

const chat = async (req, res, next) => {
    try {
        const { message, history } = req.body;
        const reply = await chatWithAI(message, history || []);
        return res.status(200).json(
            new ApiResponse(200, "OK", { reply })
        );
    } catch (error) {
        next(error);
    }
};

module.exports = { chat }
