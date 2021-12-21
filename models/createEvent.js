const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const createEventSchema = new Schema({
    title:{
      type: String,
      required: true,
    },
    category:[{
        type: String,
        required: true,
    }],
    startDate:{
        type: String,
        required: true,
    },
    endDate:{
      type: String,
      required: true,
    },
    startTime:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    eventIncharge:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('NewEvents',createEventSchema);