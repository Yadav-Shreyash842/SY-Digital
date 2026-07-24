const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate");
const { aiChatValidator } = require("../validators/ai.validator");
const { chat } = require("../controllers/ai.controller");

router.post("/chat", aiChatValidator, validate, chat);

module.exports = router
