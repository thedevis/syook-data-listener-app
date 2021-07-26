const mongoose = require ('mongoose');
const Test = new mongoose.Schema({
    timestamp_minute:{
        type:Date,
        required:true,
    },
    total_message_count:{
        type:Number,
        required:true
    },
    invalid_message_count:{
        type:Number,
        required:true
    },
    message_data:{
        type:Array
    }
},{timestamps: true})
const model = mongoose.model('test', Test)
module.exports=model;
