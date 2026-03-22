const Task = require("../model/task.model")
const paginationHelper = require("../../../helpers/pagination");
//[GET] /api/v1/tasks
module.exports.index = async (req,res) => {
    try {
        const find = {
            deleted : false,
        };

        if (req.query.status) {
            find.status = req.query.status;
        }
        //Search
         if (req.query.keyword) { // kiểm tra nguoif dùng có nhập keyword hay không , nếu nhập thì mới chạy 
            find.title = {
                $regex: req.query.keyword, //$regex là tìm theo mẫu chuỗi, req.query.keyword là người dùng nhập vào 
                $options: "i" // không phân biệt hoa thường 
            };
        }
        //Pagination
        let initPagination = {
            currentPage: 1,
            limitItems: 2,
        };

        const countTasks = await Task.countDocuments(find);

        const objectPagination = paginationHelper(
            initPagination,
            req.query,
            countTasks
        );
        //End pagination 
        // Task đại diện cho model task để lấy ra danh sách công việc 
        const tasks = await Task.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
//Task.find(find)  bảo model Task đi tìm các document thỏa điều kiện trong biến find
        res.json({
            tasks: tasks,
            pagination: objectPagination
        }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//[PATCH] /api/v1/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
//kiểm tra xem có trường trạng thái hay không 
         if (!status) {
            return res.status(400).json({
                message: "Thiếu trạng thái cần cập nhật"
            });
        }

        await Task.updateOne(
            {_id : id },
            {status: status}
        )
        res.json({
            message: "Cập nhật trạng thái thành công",
            id: id,
            status: status
        });
    } catch (error) {
        res.status(500).json({
            message: "Cập nhật trạng thái thất bại",
            error: error.message
        });
    }

};

//[PATCH] /api/v1/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body: ids (mảng ID), key (trường cần cập nhật), value (giá trị mới)
        const {ids, key, value} = req.body;
// sử dụng object destructuring 
        // Kiểm tra ids phải là mảng và không rỗng
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message : "Danh sách ids không hợp lệ"
            })
        }

        // Kiểm tra key phải là "status" và value không rỗng
        if (key !== "status" || !value || value.trim() === "") {
             return res.status(400).json({
                message : "Trạng thái không hợp lệ"
            })
        }

        // Cập nhật trạng thái của nhiều task trong database
        const result = await Task.updateMany(
            {_id : {$in : ids}},
            {status : value}
        );

        // Trả về response thành công
         res.status(200).json({
            message: "Cập nhật trạng thái nhiều công việc thành công",
            ids: ids,
            status: value
        });
    } catch (error) {
        // Xử lý lỗi và trả về response lỗi
        res.status(500).json({
            message: "Cập nhật trạng thái nhiều công việc thất bại",
            error: error.message
        });
    }
}