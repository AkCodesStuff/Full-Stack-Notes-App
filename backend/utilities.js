const jwt = require('jsonwebtoken')

function authenticateToken(req,res,next) {
    console.log("Authentication Started")
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    
    if(!token) return res.sendStatus(401);


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){ 
            console.log(err)
            return res.sendStatus(401);
        }   
        console.log("verified")
        req.user = user
        next()
    })
}

module.exports = {
    authenticateToken
}