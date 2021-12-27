const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clubAchievments = new Schema({
    clubName:{
        type: String,
    },
    images: [{
        imgpath:{
            type: String,
          required: true,
        },
    }]
});
module.exports = mongoose.model('achievements',clubAchievments);