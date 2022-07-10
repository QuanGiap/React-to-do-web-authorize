const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const TasksSchema = new Schema({
    lastUpdate:{
        type: Number,
        required: true
    },
    tasks:{
        type: Array,
        required: true
    },
    columns:{
        type: Array,
        required: true
    },
    columnsId:{
        type:Array,
        required: true
    }
},
    {timestamps: true}
)

const Task = mongoose.model('Tasks',TasksSchema);
module.exports = Task;