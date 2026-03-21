const express = require("express");
const router = express.Router();

const controller = require("../controllers/task.controller");

router.get("/", controller.index); //gọi hàm index trong controller

router.patch("/change-status/:id", controller.changeStatus)

module.exports = router;

//routes giống như bản chỉ đường 