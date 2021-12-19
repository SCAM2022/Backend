const Club = require('../models/craeteClub');

const express = require('express');
const fs = require('fs')
const app = express();
const authController = require('../controller/createClub');
const multer = require('multer');
const { append } = require('express/lib/response');
const router = express.Router();


const path = require('path');
const removeUploadedFiles = require('multer/lib/remove-uploaded-files');
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
exports.checkClub = async(req,res,next)=>{
    try{
        const obj = JSON.parse(JSON.stringify(req.body));
        //console.log(obj);
        const name = obj.name;
        const clubName = await Club.isThisClub(name);
        if(!clubName) {
            return res.status(400).json({
                success:false,
                type:'name',
                msg:"The Club name is already exist !"
            })
        }
        res.status(200).json({
            success:true,
            type:'name',
            msg:"The Club name is unique!"
        })
    }
    catch(e){
        res.status(400).send(e);
       }
}
exports.createClub = async(req,res,next)=>{
    try{
        const obj = JSON.parse(JSON.stringify(req.body));
        //console.log(obj);
        const name = obj.name;
        const disc = obj.disc;
        const goal = obj.goal;
        const authDoc = req.file.path;
        const authBy = obj.authBy;
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
            res.status(200).send(newClub);
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