const SignUp = require('../models/auth');
const bcrypt = require("bcryptjs");
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

 //checking email is present or not
 exports.postCheckEmail = async(req,res,next)=>{
    try {
        const err = validationResult(req);
    if(!err.isEmpty()){
        console.log("yeahh")
       const e = new Error("Invalid Email !");
       e.type="email";
       throw e
    }
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    const email = obj.email;
    const newUser = await SignUp.isThisEmail(email);
    if(!newUser)  res.status(400).json({
        success:false,
        type:'email',
        msg:"This email is already taken !"
    })
    else{
        res.status(200).json({
            success:true,
             type:'email',
            msg:"This email is unique!"
        })
    }
    
 }
 catch (error) {
    next(error);
}
}

// checking rollNumber and enrollmentNumber is already present or not

exports.postCheckRoll = async(req,res,next)=>{
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    const enroll = obj.enrollmentNo;
    const rollno = obj.rollNumber;
 
    const newRoll = await SignUp.isThisRoll(rollno);
    if(!newRoll) return res.status(400).json({
        success:false,
        type:'roll',
        msg:"This Roll Number is already taken !"
    })

     //checking Enroll number is present or not
   const newEnroll = await SignUp.isThisEnroll(enroll);
   if(!newEnroll) return res.status(400).json({
       success:false,
       type:'enroll',
       msg:"This Enrollment number  is already prensent"
   })
    else{
        res.status(200).json({
            success:true,
             type:'rollNumber and Enrollment',
            msg:"This Roll number and Enrollment Number is unique"
        })
    }
    
}

exports.postSignUp = async(req,res,next) => {
    //console.log(req. body);
  
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    const name = obj.person;
    const rollno = obj.rollNumber;
    const phone = obj.phone;
    const dept = obj.department;
    const enroll = obj.enrollmentNo;
    const admissionYear = obj.admissionYear;
    const year = obj.year;
    const semester = obj.semester;
    const email = obj.email;
    const password = obj.password;
    const securePassword= await bcrypt.hash(password,10);
    


    const user = new SignUp({
        name: name,
        email: email,
        department: dept,
        rollno: rollno,
        enroll: enroll,
        admissionYear:admissionYear,
        semester:semester,
        year:year,
        phone:phone,
        password: securePassword
    })
    user.save()
        .then(result =>{
            console.log('SignedUp !');
            res.status(200).json({
                success:true,
                msg:"User Registered Successfully !"
            }).redirect('/');
            
        })
        .catch(err =>{
            console.log(err);
        })
}

exports.getSignUp = (req,res,next) =>{
    res.send(
        '<form action="/authenticate"method="POST"><input type="text" name="name" placeholder="Name"><br/><input type="email" name="Auth" placeholder="email"><br/><input type="text" name="roll" placeholder="RollNo"><br/><input type="text" name="dept" placeholder="department"><br/><input type="text" name="enroll" placeholder="enrollment"><br/><input type="text" name="passout" placeholder="passout"><br/><input type="password" name="Password"><br/><button type="submit">submit</submit> </form>')
}

exports.postSignIn = async(req,res,next) => {
    //console.log(req. body);
  try{
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    const email = obj.Auth;
    const password = obj.Password;
    const findStudent = await SignUp.findOne({email:email});
    const matchpass = await bcrypt.compare(password,findStudent.password);

    if(matchpass){
        const token = jwt.sign({email},"Khemchandpatel784@gamil.com_9691417515_kn8Rider",{
            expiresIn:"1h"
        });
        console.log(token);
        console.log('->',findStudent);
        res.json({token,id:findStudent._id});
    }else{
        res.status(400).send("Login credentials invalid..");
    }
   }
  catch(e){
    res.status(400).send(e);
   }
    
}
exports.getSignIn = async(req,res,next) =>{
    const findStudent = await SignUp.find();
    res.send(findStudent);
}
exports.getUser = async(req,res,next)=>{
    try{  const obj = JSON.parse(JSON.stringify(req.body));
        console.log(obj);
          const id = req.body.id;
          const findUser = await SignUp.findById(id);
          if(findUser){
              res.status(200).send(findUser);
          }else{
              res.status(404).json({
                  type:'Authentication',
                  msg:'Invalid user request !',
                  success:false
              })
          }
    }
    catch(e){
        res.status(400).send(e);
       }
}