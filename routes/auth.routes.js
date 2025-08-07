const express=require("express");
const router= express.Router();

const {register,login, logout} =require("../controllers/auth.controller")
const {encryptData,decryptData} = require("../utils/encryption");
const {otpFunction,verifyOtp}=require("../utils/sendOtp");
router.post("/data/encrypt",encryptData);
router.post("/data/decrypt",decryptData);



router.get("/registerPage", (req, res) =>{
  res.render("pages/registerUi", { error: null }); 
});

// router.post("/register",decryptData,register);
router.post("/register",register);



router.get("/loginPage",(req,res)=>{
    res.render("pages/loginUi",{error:null});
})




// router.get("/login",decryptData,login);
// router.get("/login",login);

router.get("/logout",logout);

router.post("/login",login);


router.post("/send-otp",otpFunction);
router.post("/verify-otp",verifyOtp);
module.exports=router;