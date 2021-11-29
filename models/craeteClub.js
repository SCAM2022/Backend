const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const createClubSchema = new Schema({
    name:{
      type: String,
      required: true,
      unique:[true,"Club is already present!!"]
    },
    disc:{
        type: String,
        required: true,
    },
    goal:{
        type: String,
        required: true,
    },
    authDocs:{
      type: String,
      required: true,
    },
    authorizedBy:{
        type: String,
        required: true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('NewClubs',createClubSchema);