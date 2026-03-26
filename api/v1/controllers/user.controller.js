const User = require("../model/user.model");
const bcrypt = require("bcryptjs");

// [POST] /api/v1/users/register
module.exports.Register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        });

        await user.save();

        res.cookie("token", user.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            code: 201,
            message: "Dang ky nguoi dung thanh cong",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                status: user.status
            }
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Loi server"
        });
    }
};

// [POST] /api/v1/users/login
module.exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email,
            deleted: false
        });

        if (!user) {
            return res.status(401).json({
                message: "Email khong ton tai"
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                message: "Tai khoan da bi khoa"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Email hoac mat khau khong dung"
            });
        }

        const token = user.token;
        res.cookie("token", token);

        return res.status(200).json({
            code: 200,
            message: "Dang nhap thanh cong",
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Dang nhap that bai"
        });
    }
};
