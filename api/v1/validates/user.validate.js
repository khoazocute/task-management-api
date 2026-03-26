const User = require("../model/user.model");

module.exports.register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

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

        next();
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Loi server"
        });
    }
};

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

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

    next();
};
