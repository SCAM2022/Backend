const Club = require("../models/craeteClub");
const list = require("../models/Memberlist");
const achievements = require("../models/clubAchievements");
const User = require("../models/auth");
const Chat = require("../models/testomonial");
const express = require("express");
const fs = require("fs");
const app = express();
const authController = require("../controller/createClub");
const multer = require("multer");
const { append } = require("express/lib/response");
const router = express.Router();

const path = require("path");
// const base = path.join(__dirname,'..')
// console.log(base)
const removeUploadedFiles = require("multer/lib/remove-uploaded-files");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/club");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.originalname + `_${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a pdf file !!!"));
  }
};
exports.upload = multer({
  storage: fileStorage,
  // fileFilter:multerFilter
});
exports.checkClub = async (req, res, next) => {
  try {
    const obj = JSON.parse(JSON.stringify(req.body));
    //console.log(obj);
    const name = obj.name;
    const clubName = await Club.isThisClub(name);
    if (!clubName) {
      return res.status(400).json({
        success: false,
        type: "name",
        msg: "The Club name is already exist !",
      });
    }
    return res.status(200).json({
      success: true,
      type: "name",
      msg: "The Club name is unique!",
    });
  } catch (e) {
    return res.status(400).send(e);
  }
};
exports.createClub = async (req, res, next) => {
  try {
    console.log(req.files);
    const obj = JSON.parse(JSON.stringify(req.body));
    //console.log(obj);
    const name = obj.name;
    const disc = obj.disc;
    const goal = obj.goal;
    const authBy = obj.authBy;
    const preName = obj.preName;
    const id = obj.id;
    // const authDoc = req.files[0].path;
    // const clubImage = req.files[1].path;
    if (req.files.length > 1) {
      // console.log("size....")
      var authDoc = req.files[0].path;
      var clubImage = req.files[1].path;
    } else {
      // console.log("size....")
      var authDoc = req.files[0].path;
    }
    // checking Club name already exist or not
    // const clubName = await Club.isThisClub(name);
    // if(!clubName) {
    //    // removeUploadedFiles(req.file.path)
    //    fs.unlink(req.file.path, (err) => {
    //     if (err) {
    //       console.error(err)
    //       return
    //     }

    //     //file removed
    //   })
    //     return res.status(400).json({
    //         success:false,
    //         type:'name',
    //         msg:"The Club name is already exist !"
    //     })
    // }
    if (req.files.length > 1) {
      var newClub = new Club({
        name: name,
        disc: disc,
        goal: goal,
        authorizedBy: authBy,
        authDocs: authDoc,
        clubImage: clubImage,
      });
    } else {
      var newClub = new Club({
        name: name,
        disc: disc,
        goal: goal,
        authorizedBy: authBy,
        authDocs: authDoc,
      });
    }

    const newList = new list({
      clubName: name,
      info: [
        {
          prename: preName,
          Role: obj.Role,
          joinedOn: obj.date,
          memberId: id,
        },
      ],
    });
    const chat = new Chat({
      clubName: name,
    });
    chat.save();
    const newAchievement = new achievements({
      clubName: name,
    });
    newClub
      .save()
      .then((result) => {
        User.findById(id).then((ele) => {
          console.log(ele);
          const clb = ele.joinedClubs;
          clb.push({
            clubName: name,
            role: obj.Role,
            joinedOn: obj.date,
          });
          ele.joinedClubs = clb;
          ele.save().then((re) => {
            console.log(clb);
          });
        });

        newList.save();
        chat.save();
        newAchievement
          .save()
          .then((rslt) => {
            const paths = newClub.authDocs.toString();
            const baseDir = path.join(__dirname, "..");
            // console.log(base)
            return res.status(200).json({ newClub, baseDir });
          })
          .catch((err) => {
            return res.status(400).json({ msg: "Couldn't created club !!" });
            console.log(err);
          });
      })
      .catch((err) => {
        return res.status(400).json({ msg: "Couldn't created club !!" });
        console.log(err);
      });
  } catch (e) {
    return res.status(400).send(e);
  }
};
exports.findClub = async (req, res, next) => {
  const clubs = await Club.find();
  if (clubs) {
    const baseDir = path.join(__dirname, "..");
    return res.status(200).send({ clubs, baseDir });
  } else {
    return res.status(400).json({ msg: "Couldn't find club !" });
  }
};
exports.joinClub = async (req, res, next) => {
try {
  const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const name = obj.name;
  const Role = obj.Role;
  const joinedOn = obj.joinedOn;
  const id = obj.id;

  list.findOne({ clubName }).then((list) => {
    User.findById(id).then((ele) => {
      console.log(ele);
      const clb = ele.joinedClubs;
      clb.map((data) => {
        if (data.clubName == clubName) {
          return res.json({ msg: "club Already Joined !" });
        }
      });
      clb.push({
        clubName: clubName,
        role: Role,
        joinedOn: joinedOn,
      });
      ele.joinedClubs = clb;
      ele.save().then((re) => {
        console.log(clb);
      });
      const l = list.info;
      l.push({
        prename: name,
        Role: Role,
        joinedOn: joinedOn,
        memberId: id,
      });
      list.info = l;
      list.save().then((rslt) => {
        console.log(l);
        return res.send("OK");
      });
    });
  });
} catch (error) {
  return res.status(400).send(error);
}
};
exports.leftClub = async (req, res, next) => {
  try {
    const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const id = obj.id;

  list.findOne({ clubName }).then((list) => {
    User.findById(id)
      .then((ele) => {
        console.log(ele);
        const arr = [];
        ele.joinedClubs.map((e) => {
          if (e.clubName != clubName) {
            arr.push(e);
          }
        });
        ele.joinedClubs = arr;
        ele.save().then((re) => {
          console.log(arr);
        });
      })
      .catch((err) => {
        return res.status(404).json({ msg: "User not found in this club !" });
      });
    const l = [];
    list.info.map((ele) => {
      if (ele.memberId != id) {
        l.push(ele);
      }
    });
    list.info = l;
    list
      .save()
      .then((re) => {
        // console.log(l);
        return res.status(200).json({ msg: "Club left successfully !" });
      })
      .catch((err) => {
        return res.status(400).json({ msg: "Couldn't left club !" });
      });
  });
  } catch (error) {
    return res.status(400).send(error);
  }
};
exports.postSingleClub = async (req, res, next) => {
 try {
  const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const club = await Club.findOne({ name: clubName });
  if (club) {
    const baseDir = path.join(__dirname, "..");
    return res.status(200).send({ club, baseDir });
  } else {
    return res.status(400).json({ msg: "Couldn't find club !" });
  }
 } catch (error) {
  return res.status(400).send(error);
 }
};
exports.getMemberList = async (req, res, next) => {
 try {
  const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const members = await list.find({ clubName: clubName });
  if (members) {
    return res.status(200).send(members);
  } else {
    return res.status(400).json({ msg: "Couldn't find club !" });
  }
 } catch (error) {
  return res.status(400).send(error);
 }
};
exports.postDeleteClub = async (req, res, next) => {
 try {
  const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const club = await Club.findOneAndDelete({ name: clubName });
  const li = await list.findOneAndDelete({ clubName });
  const achieve = await achievements.findOneAndDelete({ clubName });
  const chat = await Chat.findOneAndDelete({ clubName });
  User.find()
    .then((ele) => {
      ele.map((val) => {
        const arr = [];
        val.joinedClubs.map((e) => {
          if (e.clubName != clubName) {
            arr.push(e);
          }
          console.log("data", arr);
          val.joinedClubs = arr;
          val.save().then((re) => {
            console.log(arr);
          });
        });
      });
      User.save().then((re) => {
        console.log(re);
      });
    })
    .catch((err) => {
      return res.status(400).json({ msg: "Couldn't delete club !" });
    });
  if (club && li && achieve && chat) {
    return res.status(200).json({ msg: "Club deleted succesfully!" });
  } else {
    return res.status(400).json({ msg: "Couldn't delete club !" });
  }
 } catch (error) {
  return res.status(400).send(error);
 }
};

exports.chat = async (req, res, next) => {
 try {
  const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const chat = await Chat.findOne({ clubName: clubName });
  if (chat) {
    return res.status(200).send(chat);
  } else {
    return res.status(404).json({ msg: "Club not found !" });
  }
 } catch (error) {
  return res.status(400).send(error);
 }
};

// exports.chats = async (req, res, next) => {
//   const obj = JSON.parse(JSON.stringify(req.body));
//   const clubName = obj.clubName;
//   const memberId = obj.memberId;
//   const msg = obj.msg;
//   const member = await User.findById(memberId);
//   const chat = await Chat.findOne({ clubName: clubName });
//   if (chat && this.getMemberList) {
//     const li = chat.chats;
//     li.push({
//       userId: memberId,
//       message: msg,
//       sender: member.name,
//     });
//     chat.chats = li;
//     chat
//       .save()
//       .then((re) => {
//         return res.status(200).json({ msg: "message sent successfully!" });
//       })
//       .catch((err) => {
//         return res.status(400).json({ msg: "message not sent !" });
//       });
//   } else {
//     return res.status(404).json({ msg: "Club not found !" });
//   }
// };
// exports.editMsg = async (req, res, next) => {
//   const obj = JSON.parse(JSON.stringify(req.body));
//   const clubName = obj.clubName;
//   const msgId = obj.msgId;
//   const memberId = obj.memberId;
//   const msg = obj.msg;
//   const member = await User.findById(memberId);
//   const chat = await Chat.findOne({ clubName: clubName });
//   if (chat && member) {
//     const li = chat.chats;
//     li.map((val) => {
//       if (val._id == msgId) {
//         (val.msg = msg),
//           (val.memberId = memberId),
//           (val.memberName = member.name);
//       }
//     });
//     chat
//       .save()
//       .then((re) => {
//         return res.status(200).json({ msg: "message edited successfully!" });
//       })
//       .catch((err) => {
//         return res.status(400).json({ msg: " couldn't edit message !" });
//       });
//   } else {
//     return res.status(404).json({ msg: "Club not found !" });
//   }
// };

exports.deleteMsg = async (req, res, next) => {
  try {
    const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const msgId = obj.msgId;
  const memberId = obj.userId;
  const club = await list.findOne({ clubName });
  // console.log(club);
  const chat = await Chat.findOne({ clubName: clubName });
  if (chat && club) {
    let president = false;
    club.info.map((dat) => {
      if (dat.memberId == memberId) {
        if (dat.Role == "President") {
          president = true;
        }
      }
    });
    if (president) {
      const li = chat.chats;
      const newList = [];
      li.map((val) => {
        if (val._id != msgId) {
          newList.push(val);
        }
      });
      chat.chats = newList;
      chat
        .save()
        .then((re) => {
          return res.status(200).json({ msg: "message deleted successfully!" });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ msg: " you don't have rights to delete msg  !" });
        });
    } else {
      return res.status(400).json({ msg: "you don't  rights to delete msg !" });
    }
  } else {
    return res.status(404).json({ msg: "Club not found !" });
  }
  } catch (error) {
    return res.status(400).send(error);
  }
};
//module.exports=upload;
