const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clubAchievments = new Schema({
    clubName:{
        type: String,
    },
    images: [{
        imgpath:{
            type: String,
        },
    }]
});
module.exports = mongoose.model('achievements',clubAchievments);