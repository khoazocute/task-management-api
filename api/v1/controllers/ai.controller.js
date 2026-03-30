const aiService = require("../services/ai.service");

// [POST] /api/v1/ai/chat
module.exports.chat = async (req, res) => {
  try {
    const result = await aiService.chat({
      ...req.body,
      userLabel: req.body.userLabel || req.user?.fullName,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Khong the xu ly chat AI",
    });
  }
};
