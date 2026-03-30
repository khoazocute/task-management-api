const userService = require("../services/user.service");

function buildCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

// [POST] /api/v1/users/register
module.exports.Register = async (req, res) => {
  try {
    //Nơi xử lý logic đăng ký người dùng, ví dụ: kiểm tra dữ liệu, tạo người dùng mới, v.v.
    // Ở đây controller sẽ gọi service để thực hiện công việc này, và service sẽ trả về kết quả cho controller.
    const result = await userService.register(req.body);
    res.cookie("token", result.token, buildCookieOptions());

    return res.status(201).json({
      code: result.code,
      message: result.message,
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Loi server",
    });
  }
};

// [POST] /api/v1/users/login
module.exports.Login = async (req, res) => {
  try {
    const result = await userService.login(req.body);

    res.cookie("token", result.token, buildCookieOptions());

    return res.status(200).json({
      code: result.code,
      message: result.message,
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Dang nhap that bai",
    });
  }
};

// [POST] /api/v1/users/forgot-password
module.exports.ForgotPassword = async (req, res) => {
  try {
    const result = await userService.forgotPassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Forgot password email error:", error);
    }

    if (error.message === "NODEMAILER_NOT_INSTALLED") {
      return res.status(500).json({
        code: 500,
        message: "Chua cai nodemailer de gui email OTP",
      });
    }

    if (error.message === "EMAIL_CONFIG_MISSING") {
      return res.status(500).json({
        code: 500,
        message: "Chua cau hinh EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS",
      });
    }

    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: process.env.NODE_ENV === "production" ? "Gui OTP that bai" : error.message,
    });
  }
};

// [POST] /api/v1/users/reset-password
module.exports.ResetPassword = async (req, res) => {
  try {
    const result = await userService.resetPassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Dat lai mat khau that bai",
    });
  }
};
