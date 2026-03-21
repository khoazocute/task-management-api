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

        await Task.updateOne(
            {_id : id },
            {_status: status}
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