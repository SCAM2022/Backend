const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const testomonial = new Schema({
  clubName: {
    type: String,
  },
  chats: [
    {
      message: {
        type: String,
      },
      userId: {
        type: String,
      },
      sender: {
        type: String,
      },
      time: {
        type: Date,
      },
    },
  ],
});
module.exports = mongoose.model("testomonial", testomonial);
