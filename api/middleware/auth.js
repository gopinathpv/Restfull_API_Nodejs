
const token = require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try{
        const tohead = req.headers.authorization.split(" ")[1];
        const decode = token.verify(tohead,'secret')
        req.userDate = decode;
        next();
    }catch(error){
        return res.status(401).json({
            message: "Auth Failed"
        })
}
}