const express = require("express");
const router = express.Router();

const controller = require("../controllers/ai.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware.requireAuth);
router.post("/chat", controller.chat);

module.exports = router;
