// built in modules
const jwt = require('jsonwebtoken')
// user defined modules
const result = require('../utils/result');
const config = require('../utils/config');

// to authorize the same user is requesting or not
function authorization(req, res, next){
    if(req.url == '/users/registration' || 
        req.url == '/users/login')
    {
        next()
    }else{
        // this will execute for requests like placing the order, buying item , etc
        // which should be done by only logged in user
        const token = req.headers.token
        console.log("token " + token);
        
        if(token){
            try{
                const payload = jwt.verify(token, config.secret)
                console.log("payload: " + payload);
                
                // here payload is object in which we have set property userId in user.js 
                // when user logged in @ that time we have set this property
                req.headers.userId = payload.userId 
                next()
            } catch(e){
                console.log("e "+e);
                
                res.send(result.createErrorResult("Invalid token"))
            }
        }else{
            res.send(result.createErrorResult('Token is missing'))
        }
    }
}

//exporting authorization function as a module
module.exports = authorization