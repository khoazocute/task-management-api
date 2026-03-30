const User = require("../model/user.model");

module.exports.register = async (req, res, next) => {
    try {
        const fullName = req.body.fullName?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                code: 400,
                message: "Vui long dien day du thong tin"
            });
        }

        if (fullName.length < 2) {
            return res.status(400).json({
                code: 400,
                message: "Ho ten phai co it nhat 2 ky tu"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                code: 400,
                message: "Email khong dung dinh dang"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                code: 400,
                message: "Mat khau phai co it nhat 6 ky tu"
            });
        }

        const existEmail = await User.findOne({
            email: email,
            deleted: false
        });

        if (existEmail) {
            return res.status(400).json({
                code: 400,
                message: "Email da ton tai"
            });
        }

        req.body.fullName = fullName;
        req.body.email = email;
        next();
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Loi server"
        });
    }
};

module.exports.login = (req, res, next) => {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            code: 400,
            message: "Vui long nhap day du thong tin"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            code: 400,
            message: "Email khong dung dinh dang"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            code: 400,
            message: "Mat khau phai co it nhat 6 ky tu"
        });
    }

    req.body.email = email;
    next();
};

module.exports.forgotPassword = (req, res, next) => {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
        return res.status(400).json({
            code: 400,
            message: "Vui long nhap email"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            code: 400,
            message: "Email khong dung dinh dang"
        });
    }

    req.body.email = email;
    next();
};

module.exports.resetPassword = (req, res, next) => {
    const email = req.body.email?.trim().toLowerCase();
    const { otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
        return res.status(400).json({
            code: 400,
            message: "Vui long dien day du thong tin"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            code: 400,
            message: "Email khong dung dinh dang"
        });
    }

    if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
            code: 400,
            message: "OTP phai gom 6 chu so"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            code: 400,
            message: "Mat khau phai co it nhat 6 ky tu"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            code: 400,
            message: "Xac nhan mat khau khong khop"
        });
    }

    req.body.email = email;
    next();
};
