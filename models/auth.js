const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const signUpSchema = new Schema({
    name:{
      type: String,
      required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type:Number,
        required:true
    },
    department:{
        type: String,
        required: true,
    },
    rollno:{
      type: Number,
      unique: true
    },
    enroll:{
        type: String,
        unique: true
    },
    year:{
       type:Number,
       required:true,
    },
    admissionYear:{
        type: Number,
        required: true
    },
    semester:{
        type:Number,
        required:true
    },
    password:{
        type: String,
        required: true
    }
});
signUpSchema.statics.isThisEmail = async function(email){
    try {
        const user = await this.findOne({email})
        if(user) return false;

        return true;
    } catch (error) {
        console.log('error inside method ',error.message)
        return false;
    }
}
signUpSchema.statics.isThisRoll = async function(rollno){
    try {
        const user = await this.findOne({rollno})
        if(user) return false;

        return true;
    } catch (error) {
        console.log('error inside method ',error.message)
        return false;
    }
}
signUpSchema.statics.isThisEnroll = async function(enroll){
    try {
        const user = await this.findOne({enroll})
        if(user) return false;

        return true;
    } catch (error) {
        console.log('error inside method ',error.message)
        return false;
    }
}
module.exports = mongoose.model('SignUp',signUpSchema);