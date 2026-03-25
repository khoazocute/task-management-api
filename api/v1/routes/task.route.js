const express = require("express");
const router = express.Router();

const controller = require("../controllers/task.controller");

router.get("/", controller.index); //gọi hàm index trong controller

router.patch("/change-status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti)

router.post("/create", controller.Create_task)

router.patch("/edit/:id", controller.editTask)

router.delete("/delete/:id", controller.deleteTask)
module.exports = router;

//routes giống như bản chỉ đường 