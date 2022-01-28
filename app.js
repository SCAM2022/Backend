const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const authenticationRoutes = require("./router/auth");
const clubRoutes = require("./router/createClub");
const eventRoutes = require("./router/createEvent");
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// console.log('yha')
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(authenticationRoutes, clubRoutes, eventRoutes);

app.use((err, req, res, next) => {
  console.log("msg");
  const msg = err.message;
  const type = err.type;
  const success = false;
  res.status(400).send({ type: type, msg: msg, success: success });
  // console.log(err);
});
mongoose
  .connect(
    "mongodb+srv://khem:jkO7waXYN1JhDm3h@data.j0xa8.mongodb.net/scam?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("Connected !");
  })
  .catch((err) => {
    console.log(err);
  });

var server = app.listen(5000);
var client = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    //   allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
// app.set("socketio", io);

const Chat = require("./models/testomonial");

// console.log("->", client.engine);

client.on("connection", async (socket) => {
  console.log("USER CONNECTED " + socket.id);
  // let chat = mongoClient.db('check').collection('chats');

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("user", socket.id, " joined->", data);
  });
  socket.on("send_message", (data) => {
    console.log("user", socket.id, ", sent->", data);
    saveToDB(data);

    socket.broadcast.to(data.clubName).emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected" + socket.id);
  });
});

const saveToDB = async (data) => {
  console.log("saving message->", data);
  try {
    const clubName = data.clubName;
    const memberId = data.userId;
    const msg = data.message;
    const chat = await Chat.findOne({ clubName: clubName });
    if (chat) {
      const li = chat.chats;
      li.push({
        userId: memberId,
        message: msg,
        sender: data.sender,
        date: data.date,
      });
      chat.chats = li;
      chat
        .save()
        .then((re) => {
          console.log("message saved");
        })
        .catch((err) => {
          console.log("error while saving message");
        });
    } else {
      console.log("club not found while saving message");
    }
  } catch (e) {
    console.log("error while saving message into DB");
  }
};
