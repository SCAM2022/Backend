const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const participationList = new Schema({
    eventName:{
        type: String,
    },
    participatedStudents: [{
        name:{
            type: String,
          required: true,
        }
    }],
    });
module.exports = mongoose.model('participationList',participationList);