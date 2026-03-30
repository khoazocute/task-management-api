const Task = require("../model/task.model");
const paginationHelper = require("../../../helpers/pagination");

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const ALLOWED_STATUS = ["initial", "doing", "finish"];

module.exports.getTaskList = async (query, user) => {
  const find = {
    deleted: false,
    userId: user._id, // Chỉ lấy công việc của người dùng hiện tại
    // Nếu muốn lấy tất cả công việc của tất cả người dùng, có thể bỏ dòng này đi. 
    // Tuy nhiên, trong hầu hết các ứng dụng quản lý công việc,
    //  mỗi người dùng thường chỉ xem được công việc của mình, 
    // sẽ giữ dòng này để đảm bảo tính riêng tư và bảo mật dữ liệu.
  };

  if (query.status) {
    find.status = query.status;
  }

  if (query.keyword) {
    find.title = {
      $regex: query.keyword,
      $options: "i",
    };
  }

  const initPagination = {
    currentPage: 1,
    limitItems: 2,
  };

  const countTasks = await Task.countDocuments(find);
  const pagination = paginationHelper(initPagination, query, countTasks);

  const tasks = await Task.find(find)
    .limit(pagination.limitItems)
    .skip(pagination.skip)
    .sort({ createdAt: -1 });

  return {
    code: 200,
    message: "Lay danh sach cong viec thanh cong",
    data: tasks,
    pagination,
  };
};

module.exports.changeStatus = async (taskId, status, user) => {
  if (!status) {
    throw createHttpError(400, "Thieu trang thai can cap nhat");
  }

  if (!ALLOWED_STATUS.includes(status)) {
    throw createHttpError(400, "Trang thai khong hop le");
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, deleted: false, userId: user._id },
    { status },
    { new: true }
  );

  if (!task) {
    throw createHttpError(404, "Khong tim thay cong viec");
  }

  return {
    code: 200,
    message: "Cap nhat trang thai thanh cong",
    data: task,
  };
};

module.exports.changeMultiStatus = async (payload, user) => {
  const { ids, key, value } = payload;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw createHttpError(400, "Danh sach ids khong hop le");
  }

  if (key !== "status" || !value || !ALLOWED_STATUS.includes(value)) {
    throw createHttpError(400, "Trang thai khong hop le");
  }

  const result = await Task.updateMany(
    {
      _id: { $in: ids },
      deleted: false,
      userId: user._id,
    },
    { status: value }
  );

  if (result.matchedCount === 0) {
    throw createHttpError(404, "Khong tim thay cong viec nao de cap nhat");
  }

  return {
    code: 200,
    message: "Cap nhat nhieu cong viec thanh cong",
    data: {
      ids,
      status: value,
      modifiedCount: result.modifiedCount,
    },
  };
};

module.exports.createTask = async (payload, user) => {
  const { title, status, content, timeStart, timeFinish } = payload;

  if (!title || title.trim() === "") {
    throw createHttpError(400, "Truong title khong duoc de trong");
  }

  if (status && !ALLOWED_STATUS.includes(status)) {
    throw createHttpError(400, "Truong status khong hop le");
  }

  const task = new Task({
    title: title.trim(),
    status: status || "initial",
    content: content || "",
    timeStart,
    timeFinish,
    userId: user._id,
  });

  const savedTask = await task.save();

  return {
    code: 201,
    message: "Tao cong viec thanh cong",
    data: savedTask,
  };
};

module.exports.editTask = async (taskId, payload, user) => {
  const { title, status, content, timeStart, timeFinish } = payload;
  const updateData = {};

  if (title !== undefined) {
    if (title.trim() === "") {
      throw createHttpError(400, "Truong title khong duoc de trong");
    }

    updateData.title = title.trim();
  }

  if (status !== undefined) {
    if (!ALLOWED_STATUS.includes(status)) {
      throw createHttpError(400, "Truong status khong hop le");
    }

    updateData.status = status;
  }

  if (content !== undefined) {
    updateData.content = content;
  }

  if (timeStart !== undefined) {
    updateData.timeStart = timeStart;
  }

  if (timeFinish !== undefined) {
    updateData.timeFinish = timeFinish;
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, deleted: false, userId: user._id },
    updateData,
    { new: true }
  );

  if (!task) {
    throw createHttpError(404, "Khong tim thay cong viec");
  }

  return {
    code: 200,
    message: "Cap nhat cong viec thanh cong",
    data: task,
  };
};

module.exports.deleteTask = async (taskId, user) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, deleted: false, userId: user._id },
    {
      deleted: true,
      deletedAt: new Date(),
    },
    { new: true }
  );

  if (!task) {
    throw createHttpError(404, "Khong tim thay cong viec");
  }

  return {
    code: 200,
    message: "Xoa cong viec thanh cong",
  };
};

module.exports.deleteMultiTask = async (payload, user) => {
  const { ids } = payload;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw createHttpError(400, "Danh sach ids khong hop le");
  }

  const result = await Task.updateMany(
    {
      _id: { $in: ids },
      deleted: false,
      userId: user._id,
    },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );

  if (result.matchedCount === 0) {
    throw createHttpError(404, "Khong tim thay cong viec nao de xoa");
  }

  return {
    code: 200,
    message: "Xoa nhieu cong viec thanh cong",
    data: {
      ids,
      modifiedCount: result.modifiedCount,
    },
  };
};
