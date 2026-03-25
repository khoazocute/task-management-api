const mongoose = require('mongoose');
const generate = require("../../../helpers/generate");
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    status: {
        type: String,
    },
    content: {
        type: String,
    },
    timeStart: {
        type: Date
    },
    timeFinish: {
        type: Date
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
    }
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema, "task");
module.exports = Task;
