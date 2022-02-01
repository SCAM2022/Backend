const achievements = require("../models/clubAchievements");
const User = require("../models/auth");
const express = require("express");
const fs = require("fs");
const app = express();
const authController = require("../controller/createClub");
const multer = require("multer");
const { append } = require("express/lib/response");
const router = express.Router();

const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));
app.get(express.static(path.join(__dirname, "public")));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/achievements");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.originalname + `_${Date.now()}.${ext}`);
  },
});

// const multerFilter = (req,file,cb)=>{
//     if(file.mimetype.split("/")[1]==="pdf"){
//         cb(null,true);
//     }else{
//         cb(new Error("Not a pdf file !!!"));
//     }
// }
exports.uploadImg = multer({
  storage: fileStorage,
  // fileFilter:multerFilter
});

exports.uploadImages = async (req, res, next) => {
  try {
    const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const img = req.file.path;
  achievements
    .findOne({ clubName })
    .then((re) => {
      const l = re.images;
      l.push({
        imgpath: img,
      });
      re.images = l;
      re.save()
        .then((r) => {
          return res
            .status(200)
            .json({ msg: "image uploaded successfully !!" });
        })
        .catch((e) => {
          return res.status(400).json({ msg: "image couldn't uploaded  !!" });
        });
    })
    .catch((e) => {
      return res.status(400).json({ msg: "image couldn't uploaded  !!" });
    })
    .catch((e) => {
      res.status(400).json({ msg: "image couldn't uploaded  !!" });
    });
  } catch (error) {
    return res.status(400).send(error);

  }
};
exports.fetchClubAchievements = async (req, res, next) => {
 try {
  const obj = JSON.parse(JSON.stringify(req.body));
  const clubName = obj.clubName;
  const achv = await achievements.findOne({ clubName });
  if (achv) {
    const baseDir = path.join(__dirname, "..");
    return res.status(200).json({
      achv,
      baseDir,
    });
  } else {
    return res.status(404).json({ msg: "club not found" });
  }
 } catch (error) {
  return res.status(400).send(error);
 }
};
