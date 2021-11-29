const SignUp = require('../models/auth');
const bcrypt = require("bcryptjs");
exports.postSignUp = async(req,res,next) => {
    //console.log(req. body);
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    const name = obj.name;
    const rollno = obj.roll;
    const dept = obj.dept;
    const enroll = obj.enroll;
    const passout = obj.passout;
    const email = obj.Auth;
    const password = obj.Password;
    const securePassword= await bcrypt.hash(password,10);
    const user = new SignUp({
        name: name,
        email: email,
        department: dept,
        rollno: rollno,
        enroll: enroll,
        passout: passout,
        password: securePassword
    })
    user.save()
        .then(result =>{
            console.log('SignedUp !');
            res.redirect('/');
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
        console.log('->',findStudent);
        res.json(findStudent);
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
exports.postData = async(req,res,next)=>{
    try{
        console.log(req.file);
        res.send("File uploaded Successfully------->");
        console.log("file",__dirname);
    }
    catch(e){
        res.status(400).send(e);
       }
}