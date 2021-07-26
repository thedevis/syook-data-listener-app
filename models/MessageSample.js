const mongoose = require ('mongoose');
const MessageSample = new mongoose.Schema({
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
},{
    timestamps: true
})
MessageSample.index({timestamp_minute:1});
const model = mongoose.model('message_time_series', MessageSample)
module.exports=model;
