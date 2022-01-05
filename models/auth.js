const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const signUpSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  department: {
    type: String,
  },
  rollno: {
    type: String,
    unique: true,
  },
  enroll: {
    type: String,
    unique: true,
  },
  year: {
    type: String,
  },
  admissionYear: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  joinedClubs:[{
       clubName:{
         type:String
       },
       role:{
         type:String
       },
       joinedOn:{
         type:String
       }
  }],
  participatedEvents:[{
    eventId:{
      type:String
    },
    eventName:{
      type:String
    }
}],
attendedEvents:[{
    date:{
      type:String,
    },
    eventId:{
        type:String
      },
      eventName:{
        type:String
      }
}],
  lastLogin:{
    type:Date,
    default:new Date()
  },
});
signUpSchema.statics.isThisEmail = async function (email) {
  try {
    const user = await this.findOne({ email });
    if (user) return false;

    return true;
  } catch (error) {
    console.log("error inside method ", error.message);
    return false;
  }
};
signUpSchema.statics.isThisRoll = async function (rollno) {
  try {
    const user = await this.findOne({ rollno });
    if (user) return false;

    return true;
  } catch (error) {
    console.log("error inside method ", error.message);
    return false;
  }
};
signUpSchema.statics.isThisEnroll = async function (enroll) {
  try {
    const user = await this.findOne({ enroll });
    if (user) return false;

    return true;
  } catch (error) {
    console.log("error inside method ", error.message);
    return false;
  }
};
module.exports = mongoose.model("SignUp", signUpSchema);
