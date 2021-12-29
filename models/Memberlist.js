const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const memberList = new Schema({
    clubName:{
        type: String,
    },
    info: [{
        prename:{
            type: String,
          required: true,
        },
        Role:{
            type: String,
        },
        joinedOn:{
            type: String
        },
        memberId:{
         type:String
        }
    }]
});
module.exports = mongoose.model('list',memberList);