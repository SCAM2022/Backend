const Club = require('../models/craeteClub');

const express = require('express');

const app = express();
const authController = require('../controller/createClub');
const multer = require('multer');
const { append } = require('express/lib/response');
const router = express.Router();


const path = require('path');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(`${__dirname}/public`))


const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public');
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split("/")[1];
        cb(null,file.originalname+`_${Date.now()}.${ext}`);
    }
})

const multerFilter = (req,file,cb)=>{
    if(file.mimetype.split("/")[1]==="pdf"){
        cb(null,true);
    }else{
        cb(new Error("Not a pdf file !!!"));
    }
}
exports.upload = multer({
    storage:fileStorage,
    fileFilter:multerFilter
});
exports.createClub = async(req,res,next)=>{
    try{
        const obj = JSON.parse(JSON.stringify(req.body));
        console.log(obj);
        const name = obj.name;
        const disc = obj.disc;
        const goal = obj.goal;
        const authDoc = req.file.path;
        const authBy = obj.authBy;
        const newClub = new Club({
            name:name,
            disc:disc,
            goal:goal,
            authDocs:authDoc,
            authorizedBy:authBy,
        })
        newClub.save()
         .then(result=>{
            console.log(req.file);
            res.send(newClub);
            console.log(newClub);
        })
        .catch(err=>{
            res.status(400).json({msg:"Couldn't created club !!"})
            console.log(err);
        })
    }
    catch(e){
        res.status(400).send(e);
       }
}
//module.exports=upload;