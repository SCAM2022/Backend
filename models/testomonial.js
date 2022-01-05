const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const testomonial = new Schema({
    clubName:{
        type: String,
    },
    chats: [{
        msg:{
            type: String,
        },
        memberId:{
            type: String,
        },
        memberName:{
            type: String,
        },
    }],
    });
module.exports = mongoose.model('testomonial',testomonial);