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
        unique: [true,"Email already taken!!"],
        validate(value){
            if(validator.isEmail(value)){
                throw new Error("Invalid Email!!")
            }
        }
    },
    department:{
        type: String,
        required: true,
    },
    rollno:{
      type: Number,
      required: true,
      unique: true
    },
    enroll:{
        type: String,
        required: true,
        unique: true
    },
    passout:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('SignUp',signUpSchema);