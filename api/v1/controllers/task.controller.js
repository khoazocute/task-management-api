const taskService = require("../services/task.service");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  try {
    const result = await taskService.getTaskList(req.query, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Khong the lay danh sach cong viec",
    });
  }
};

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const result = await taskService.changeStatus(req.params.id, req.body.status, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Cap nhat trang thai that bai",
    });
  }
};

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const result = await taskService.changeMultiStatus(req.body, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Cap nhat nhieu cong viec that bai",
    });
  }
};

// [POST] /api/v1/tasks/create
module.exports.Create_task = async (req, res) => {
  try {
    const result = await taskService.createTask(req.body, req.user);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Tao cong viec that bai",
    });
  }
};

// [PATCH] /api/v1/tasks/edit/:id
module.exports.editTask = async (req, res) => {
  try {
    const result = await taskService.editTask(req.params.id, req.body, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Cap nhat cong viec that bai",
    });
  }
};

// [DELETE] /api/v1/tasks/delete/:id
module.exports.deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Khong xoa duoc cong viec",
    });
  }
};

// [DELETE] /api/v1/tasks/delete-multi
module.exports.deleteMultiTask = async (req, res) => {
  try {
    const result = await taskService.deleteMultiTask(req.body, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      message: error.message || "Xoa nhieu cong viec that bai",
    });
  }
};
