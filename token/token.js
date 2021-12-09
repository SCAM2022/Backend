const jwt = require('jsonwebtoken');
module.exports=(req,res,next)=>{
    const key=req.get('Authorization');
if(!key){
    const err = new Error("User Unauthenticated !")
    err.type="token"
    throw err
}
try {
    const Auth =  jwt.verify(key,"Khemchandpatel784@gamil.com_9691417515_kn8Rider")
} catch (error) {
    error.type= "token"
    throw error
    
}
next()
}