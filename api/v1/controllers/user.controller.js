const User = require("../model/user.model")
const paginationHelper = require("../../../helpers/pagination");
const bcrypt = require("bcryptjs");

//[POST]api/v1/users/register

module.exports.Register = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        //  Kiểm tra dữ liệu đầu vào 
        if (!fullName || !email || !password) {
            return res.status(400).json({
                code : 400,
                message : "Vui lòng điền đầy đủ thông tin"
            });
        }

        // Validate fullName
        if (fullName.length < 2) {
            return res.status(400).json({
                code: 400,
                message: "Họ tên phải có ít nhất 2 ký tự"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                code: 400,
                message: "Email không đúng định dạng"
            });
        }

        //  Validate password
        if (password.length < 6) {
            return res.status(400).json({
                code: 400,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
            });
        }
        //  Kiểm tra email đã tồn tại chưa
        const existEmail = await User.findOne({
            email: email,
            deleted: false
        });

        if (existEmail) {
            return res.status(400).json({
                code: 400,
                message: "Email đã tồn tại"
            });
        }

        // 3. Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới và lưu vào database
        const user = new  User({
            fullName : fullName,
            email : email,
            password : hashedPassword,
        });

        await user.save() //chỉ khi chạy lệnh này thì user mới thật sự dc tạo

        //Trả kết quả
        return res.status(201).json({
            code : 201,
            message : "Đăng ký người dùng thành công",
            token : user.token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                status: user.status
            }
        });  
    } catch (error) {
    // console.error(error);
            return res.status(500).json({
            code: 500,
            message: "Lỗi server"
            });
    }
}