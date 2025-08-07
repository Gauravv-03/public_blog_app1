const rateLimit = require("express-rate-limit");

const limit =rateLimit({
    max:10,
    WindowMs:5*60 * 1000 ,
   message: "Too many requests from this IP, please try again after 5 minutes"
})
module.exports=limit;