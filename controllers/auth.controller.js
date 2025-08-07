
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var validator = require('validator');
var passwordValidator = require('password-validator');

const otpModule=require("../utils/sendOtp")
// const  {Auth}  = require("two-step-auth");
// function registerPage(req, res) {
//   res.render("registerUi", { error: null }); // or pass error from query/flash
// }

var schema = new passwordValidator();

schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase();

async function register(req,res){
   try {
       const {fullName,email,password,phoneNo,otp}=req.body;
    //    req.check("password", "Password should be 8 g").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
    console.log("validate password @@@@");
    console.log(schema.validate(req.body.password));
    const validPassword=schema.validate(req.body.password)
       console.log("₹₹₹₹₹₹₹₹₹₹₹₹");
       if(!validPassword)
       {
        return res.status(400).json({
            message:"password should be combination of one uppercase , one lower case,  one digit and min 8 , max 100 char long"
        })
       }
        //  const res =  await Auth(email);
            //  return res.render("auth/register", { error: "Invalid email address" });
    //        console.log(res);
    //    console.log(res.mail);
    //    console.log(res.OTP);
    //   console.log(res.success);
       
       const valid=validator.isEmail(email);
       
       if(!valid)
        {
            return res.status(400).json({
                message:"invalid Email"
            })
        }
        console.log("Inside Register+++");
     console.log("full",fullName,email,password,phoneNo);
 
     if(!fullName || !email || !password || !phoneNo)
     {
         return res.status(400).json({
         message:"all fields are required"    
         })
     }
     // strictly checking that phone no is completely integer or not ...
     // it will be check on databases also but  it is good practise to check before the database (reduce the cost and time)
     const isDigit=/^[+-]?\d+(\.\d+)?$/.test(phoneNo);


     if(isDigit==false)
     {
        return res.status(400).json({
            message:"Phone Number should only contain Integer Values"
            
        } )

        // res.render(`<h1>Number ___++++++</h1>`);
     }

     if(phoneNo.length !== 10)
     {
        return res.status(400).json({
            message:"phone Number should be 10 Digit Number"
        })
     }
     if(phoneNo[0]!='9' && phoneNo[0]!='8' && phoneNo!='7' && phoneNo!=6)
     {
        return res.status(400).json({
            message:"Phone Number should start with 6 ,7 ,8, 9"
        })
     }
     userModel.findByEmail(email,async(err,result)=>{
         if(err)
         {
             return res.status(500).json({
                 message:"database error",
                 meesage:err
             })
         }

         //now we will check user's present // user should not be present for registration
         if(result.length>0)
         {
             return res.status(400).json({
                 message:"user already exist"
             })
         }

        //  otpModule.verifyOtp(otp,)
         // if user not exists then hash the password
          const hashPassword =  await bcrypt.hash(password,10);
         userModel.createUser(fullName,email,hashPassword,phoneNo,(err,result)=>{
 
             // console.log(" DB response:", result);
             if(err)
                 {
                //  console.log(" Error:", err);
                 return res.status(500).json({
                     message:"user creation error",
                     message:err
                     
                 })
             }
             else{
                 // create the jwt
                 const user={
                     id:result.insertId,
                     fullName,email
                 }
 
                 const token= jwt.sign(
                     user,  process.env.JWT_SECRET,
                     {
                         expiresIn:"1d"
                     }
                 )
                 //setting the cookiw to browser
                 res.cookie("token",token,{
                    httpOnly:true
                 });
                  res.redirect("/dashboard",);



                //  res.status(201).json({
                //      message:"user register SuccessFully",
                //      user,token
                //  })
             }
         })
 
     })
   } catch (error) {
    console.log("error-- >>",error)
   }

    //check 
}


function login(req,res)
{try {
     console.log("Login POST triggered", req.body);
        const{email,password}=req.body;
    
        if(!email || !password)
        {
            return res.status(400).json({
                message:"email and password both are required"
            })
        }
     const valid=validator.isEmail(email);

    //  console.log("emaile validition ___",valid);
     if(!valid)
     {
        return res.status(400).json({
            message:"invalid Email"
        })
     }
    
        userModel.findByEmail(email,(err, users)=>{
            if(err)
            {
                return res.status(401).json({
                    meesage:"error in find by email",
                    meesage:err
                })
            }
           
                if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
                const user=users[0];
            const isMatch= bcrypt.compareSync(password,user.password);
            if(!isMatch)
            {
                return res.status(401).json({message:"invalid credential- password not matched"});
            }
            const token=jwt.sign(
                {
                    id:user.id,
                    fullName:user.fullName,
                    email:user.email
                },
                process.env.JWT_SECRET,{
                    expiresIn:"1d"
                }
            )
            // setiing the cookie
                   res.cookie("token",token,{
                    httpOnly:true,
                    // secure:true
                 })
                 res.locals.loginSuccess = true;
                //  res.redirect("/?msg=login-success");`
                console.log("login last tk");
                // console.log("print cookie",cookies);
                console.log("req.cookies ______________:", req.cookies);




                res.redirect("/dashboard",);


    
            // res.status(200).json(
            //     {
            //         message:"user login suceessfully",
            //     user:{
            //         id:user.id,
            //         fullName:user.fullName,
            //         email:user.email
            //     },
            //     token
            // });

        });
    
} catch (error) {
    console.log("error-- >>",error)
    
}


}

// auth.controller.js

function logout(req, res) {
  res.clearCookie('token');
  res.redirect('/api/auth/loginPage');
}

module.exports={
    register,login,logout
};

