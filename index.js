require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");// code theo api thì thêm biến này vào để chặn lỗi giữa be và fe
const bodyParser = require("body-parser"); // phải install cái này để trả về req.body
const cookieParser = require("cookie-parser");
const port = process.env.PORT;

const database = require("./config/database");
database.connect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));
// gọi file route
const taskRoutes = require("./api/v1/routes/task.route");
const userRoutes = require("./api/v1/routes/user.route");
app.use("/api/v1/tasks", taskRoutes); //file nào có đường dẫn là /api/v1/tasks sẽ được đưa vào taskRoutes
app.use("/api/v1/users", userRoutes);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// index.js         → khởi động app, gắn route
// routes/          → định tuyến URL
// controllers/     → xử lý nghiệp vụ
// models/          → làm việc với DB
// helpers/         → hàm hỗ trợ
// config/          → cấu hình hệ thống
