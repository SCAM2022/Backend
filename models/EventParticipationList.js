const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const participationList = new Schema({
    eventName:{
        type: String,
    },
    participatedStudents: [{
        name:{
            type: String,
        },
        memberId:{
            type: String,
        },
        email:{
            type: String,
        },
        roll:{
            type: String,
        },
        branch:{
            type: String,
        },
        isAttend:{
            type:Boolean,
            default:false
        }
    }],
    });
module.exports = mongoose.model('participationList',participationList);