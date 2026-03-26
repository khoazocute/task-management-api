const User = require("../model/user.model");
const bcrypt = require("bcryptjs");

// [POST] /api/v1/users/register
module.exports.Register = async (req, res) => {
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        });

        await user.save();

        res.cookie("token", user.token, {
            httpOnly: true, //k có phép fe đọc bằng document.cookies => an toàn
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production", // chỉ dc gửi qua HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // thời gian sống 7 ngày
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


//[POST] api/v1/login
module.exports.Login = async (req,res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                code : 400,
                message : "Vui lòng nhập đầy đủ thông tin"
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
//Kiểm tra dữ liệu có khớp không
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
                message: "Tài khoản đã bị khóa"
            });
        }
//if (password === user.password) : không được so sánh như vậy thì user.password đã dc mã hóa
        const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không đúng"
            });
        }
        
        const token = user.token;
        res.cookie('token', token );//trả token cho user
        return res.status(200).json({
            code : 200,
            message : "Đăng nhập thành công"
        });
    } catch {
         return res.status(500).json({
            code: 500,
            message: "Đăng nhập thất bại"
        });
    }
}