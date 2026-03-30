const userService = require("../services/user.service");

module.exports.requireAuth = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    const token = req.cookies.token || bearerToken;

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Ban chua dang nhap",
      });
    }

    const user = await userService.findUserByToken(token);

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Token khong hop le hoac da het han",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Khong the xac thuc nguoi dung",
    });
  }
};
