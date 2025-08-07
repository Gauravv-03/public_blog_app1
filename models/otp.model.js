const db=require("./db");

function insertOtp(email,otp,expiresAt,callback)
{
 const query = 'INSERT INTO otp_verification (email, otp, expires_at) VALUES (?, ?, ?)';
  db.query(query, [email, otp, expiresAt],callback); 
}

function verifyOtp(email,callback)
{
    const query = 'SELECT * FROM otp_verification WHERE email = ? ORDER BY created_at DESC LIMIT 1';
    db.query(query,[email],callback);
}

function deleteOtp(otpId,callback)
{
    console.log("o inside delete otp module ______++++",otpId);
    const query= 'DELETE  From otp_verification WHERE id=?'
    db.query(query,[otpId],callback);
}

module.exports={
    insertOtp,verifyOtp,deleteOtp
}