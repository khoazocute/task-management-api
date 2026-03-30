const express = require("express");
const router = express.Router();

const controller = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");
//Toàn bộ route ở đây đều yêu cầu người dùng phải đăng nhập, nên mình sẽ sử dụng middleware để kiểm tra token trước khi vào các route này. 
// Nếu token hợp lệ, người dùng sẽ được phép truy cập vào các route tiếp theo, nếu không hợp lệ, middleware sẽ trả về lỗi và ngăn chặn truy cập.
router.use(authMiddleware.requireAuth);

router.get("/", controller.index);
router.patch("/change-status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.post("/create", controller.Create_task);
router.patch("/edit/:id", controller.editTask);
router.delete("/delete/:id", controller.deleteTask);
router.delete("/delete-multi", controller.deleteMultiTask);

module.exports = router;
