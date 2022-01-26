const Chat = require("../models/testomonial");

// console.log("->", client.engine);

client.on("connection", async (socket) => {
  console.log("USER CONNECTED " + socket.id);
  // let chat = mongoClient.db('check').collection('chats');

  socket.on("join_room", (data) => {
    socket.room(data);
    console.log("user", socket.id, " joined->", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected" + socket.id);
  });
});
//FUNCTION TO SENT STATUS
const sendStatus = function (status) {
  console.log(status);
  socket.emit("status", status);
};

//GET CHAT DATA FROM MONGODB
//   const chat = await Chat.findOne({ clubName: clubName });

//Sending Data back to connected socket
console.log("___FINDING CHAT___", chat, clubName);
socket.emit("output", chat);

socket.on("input", function (data) {
  let name = data.name;
  let message = data.message;

  //checking if both fields are filled
  if (name == "" && message == "") {
    sendStatus("Please enter Name and message!!!");
  } else if (message == "") {
    sendStatus("Please Enter Message!!!");
  } else if (name == "") {
    sendStatus("Please Enter User-Name!!!");
  } else {
    //INSERTING MESSAGE IN DB
    Chat.insert({ name: name, message: message }, function () {
      client.emit("output", [data]);

      //SENDING STATUS
      sendStatus({
        message: "Message sent",
        clear: true,
      });
    });
  }
});

//HANDLING CLEAR
socket.on("clear", function (data) {
  //REMOVING ALL CHATS
  console.log("clear");
  Chat.remove({}, function (e) {
    if (e) {
      throw e;
    }
    console.log("+++++++++++++++++++++++++");
    console.log("CLEARING ALL DATA!!!");
    console.log("+++++++++++++++++++++++++");
    socket.emit("cleared");
  });
  console.log("CLEARING ALLLLLLL!!!!!!!!");
  sendStatus("CLEARED !!");
});
