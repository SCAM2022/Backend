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
createClubSchema.statics.isThisClub = async function(name){
    try {
        const club = await this.findOne({name})
        if(club) return false;

        return true;
    } catch (error) {
        console.log('error inside method ',error.message)
        return false;
    }
}
const Club = mongoose.model('Club',createClubSchema);

const memberList = new Schema({
    clubName:{
        type: String,
    },
    info: [{
        name:{
            type: String,
          required: true,
        },
        Role:{
            type: String,
        },
        joinedOn:{
            type: String
        }
    }]
});
const list = mongoose.model('list',memberList);
module.exports = {
    Club: Club,
    list: list
}