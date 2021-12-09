
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const authenticationRoutes = require('./router/auth');
const clubRoutes = require('./router/createClub');
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// console.log('yha')
app.use((req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
})
app.use(authenticationRoutes,clubRoutes)
app.use((err,req,res,next)=>{
    console.log("msg");
    const msg =err.message;
    const type =err.type;
    const success = false
    res.status(400).send({type:type,msg:msg,success:success})
   // console.log(err);
})
mongoose.connect('mongodb+srv://khem:jkO7waXYN1JhDm3h@data.j0xa8.mongodb.net/scam?retryWrites=true&w=majority')
         .then(result =>{
             console.log('Connected !');
             app.listen(3000);
         })
         .catch(err =>{
             console.log(err)
         })
 
