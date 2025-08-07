const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
require('dotenv').config();
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

const otpModule=require("../models/otp.model");
const {findByEmail}=require("../models/user.model");


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}


function otpFunction(req, res){

    console.log("inside otp function in utility folder");
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  findByEmail(email,(err,result)=>{
    if(err)
    {
      return res.status(400).json({
        message:"error in find email inside verify otp"
      })
    }
  })


  const otp = generateOTP();
  console.log("OtpTTT&&",otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  console.log("Expiryt otp ___+**",expiresAt);
  otpModule.insertOtp(email,otp,expiresAt,(err,result)=>{

 if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

  })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to:  email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send email' });
      }
      return res.status(200).json({ message: 'OTP sent successfully' });
    });
  };

function verifyOtp(req,res){
  
    try {
      const {email}=req.body;
      const {otp}=req.body;
      if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    
    otpModule.verifyOtp(email,(err,result)=>{
        if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (result.length === 0) {
        return res.status(400).json({ message: 'No OTP found for this email' });
      }
  
      
      const record = result[0];
      const now = new Date();
  
      if (record.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      if (now > new Date(record.expires_at)) {
        return res.status(400).json({ message: 'OTP expired' });
      }
  
      const otpId=record.id;
      // console.log("id OTP******",otpId);
      // delete the otp so it will not use for next time
     
  


      //get the user 
      // uit will not use next time.f
       otpModule.deleteOtp(otpId, (err) => {
        if (err) {
          console.error("Error deleting OTP:", err);
        }
      });

      
      findByEmail(email, (err, userResult) => {
        if (err || userResult.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const user = userResult[0]; 

      
        const token = jwt.sign(
          {
            id: user.id,
            fullName: user.fullName,
            email: user.email
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

  
        res.cookie("token", token, {
          httpOnly: true,
        });

        return res.redirect("/dashboard");
      });
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(400).json({ message: "Internal error", error });
  }

};

       


module.exports={otpFunction,verifyOtp}