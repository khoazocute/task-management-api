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
// [POST] /api/v1/tasks/create
// client gửi dữ liệu để tạo một công việc mới 
// → backend nhận dữ liệu → kiểm tra dữ liệu hợp lệ → tạo object theo model → lưu vào database → trả kết quả về.
module.exports.Create_task = async (req, res) => {
    try {
        const { title , status, content } = req.body;
        // post,  put, patch thuongfd đọc dữ liệu từ body không phải từ params
        //VALIDATE
        if (!title || title.trim() === ""){
            return res.status(400).json ({
                message : "Trường title không được để trống"
            });
        }
        const allowedStatus = ["initial", "doing", "finish"];
        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Trường status không hợp lệ"
            });
        }
// model là khuôn mẫu dữ liệu
// muốn lưu gì vào DB thì phải tạo object đúng theo model đó
//Dùng new Task -> save
        //Sau khi dữ liệu ổn sẽ tạo mới 
        const task = new Task ({
            title,
            status : status ||  "initial",
            content : content || "",
            deleted : false

        });
        const savedTask = await task.save(); // gọi hàm save() để lưu vào database
        //Trả kết quả về cho client
        return res.status(201).json({
            message : "Tạo công việc thành công",
            data : savedTask
        });
    } catch(error) {
         return res.status(500).json({
            message: "Tạo công việc thất bại",
            error: error.message
        });
    }
}

// [PATCH] /api/v1/task/edit/:id
// module.exports.editTask = async (req, res) => {
//     // try {
//     //     const id = req.params.id;
//     //     //const {title , content} = req.body;
//     //     await Task.updateOne({_id: id}, req.body);//Tìm đúng id và lấy tất cả dữ liệu client gửi thông qua req.body

//     //     return res.status(200).json({
//     //         message : "Cập nhật công việc thành công",
//     //     });
//     // } catch (error) {
//     //      return res.status(500).json({
//     //         message: "Cập nhật công việc thất bại",
//     //         error: error.message
//     //     });
//     // }
// //Viết theo kiểu nâng cao và ràng buộc nhiều hơn 
// }
// Validate chặt chẽ hơn , khuyên dùng 
module.exports.editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status, content } = req.body;

        const allowedStatus = ["initial", "doing", "finish"];

        if (title !== undefined && title.trim() === "") {
            return res.status(400).json({
                message: "Trường title không được để trống"
            });
        }

        if (status !== undefined && !allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Trường status không hợp lệ"
            });
        }
//Tạo upateData để chỉ cho phép sửa những trường được cho phép, có tính ràng buộc chặt chẽ hơn 
//Gửi thêm thì sẽ không update trường đó,
        const updateData = {};//Bna đầu tạo rỗng thì chưa biết frontend gửi những trường nào

        if (title !== undefined) updateData.title = title;
        if (status !== undefined) updateData.status = status;
        if (content !== undefined) updateData.content = content;

        const result = await Task.updateOne(
            { _id: id, deleted: false },
            updateData
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Không tìm thấy công việc"
            });
        }

        return res.status(200).json({
            message: "Cập nhật công việc thành công",
            data: updateData
        });
    } catch (error) {
        return res.status(500).json({
            message: "Cập nhật công việc thất bại",
            error: error.message
        });
    }
};

// Xác định bản ghi nào cần sửa → 
// lấy dữ liệu mới → kiểm tra dữ liệu hợp lệ →
//  chỉ cập nhật các field được phép → lưu xuống database → trả kết quả
// Dữ liệu gửi đi sẽ nằm ở req.body

//[Delete] /api/v1/task/delete/id
// Phải cài body raw để test postman
module.exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Task.updateOne(
            { _id: id, deleted: false },
            {
                deleted: true,
                deletedAt: new Date() // Lấy lời gian hiện tại
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Không tìm thấy công việc"
            });
        }

        return res.status(200).json({
            message: "Xóa công việc thành công"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi không xóa được",
            error: error.message
        });
    }
};

//[Delete] api/v1/task/delete-multi
//API delete-multi = nhận danh sách ids → validate → updateMany để đánh dấu xóa mềm → trả kết quả.
module.exports.deleteMultiTask = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body: ids (mảng ID), key (trường cần xóa )
        const {ids} = req.body; 
// sử dụng object destructuring 
        // Kiểm tra ids phải là mảng và không rỗng
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message : "Danh sách ids không hợp lệ"
            })
        }

        // Cập nhật trạng thái của nhiều task trong database
        // Xóa/cập nhật nhiều sẽ dùng updateMany
        const result = await Task.updateMany(
            {_id : {$in : ids}, // đây là mảng id
              deleted : false,
            },
            { deleted : true,
              deletedAt : new Date()
            }
        );
// Kiểm tra xem có data gửi lên có match với dữ liệu đúng không 
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Không tìm thấy công việc nào để xóa"
            });
        }
        // Trả về response thành công
         res.status(200).json({
            message: "Đã xóa thành công nhiều công việc",
            ids: ids,
        });
    } catch (error) {
        // Xử lý lỗi và trả về response lỗi
        res.status(500).json({
            message: "Xóa nhiều công việc thất bại ",
            error: error.message
        });
    }
}