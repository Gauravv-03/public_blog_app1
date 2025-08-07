
const crypto =require("crypto");
const config =require("../config/config.js");
const { secret_key, secret_iv, ecnryption_method } = config

if (!secret_key || !secret_iv || !ecnryption_method) {
  throw new Error('secretKey, secretIV, and ecnryptionMethod are required')
}


const key = crypto
  .createHash('sha512')
  .update(secret_key)
  .digest('hex')
  .substring(0, 32)
const encryptionIV = crypto
  .createHash('sha512')
  .update(secret_iv)
  .digest('hex')
  .substring(0, 16)


function encryptData(req,res) {

  try {
    const data=req.body;
    if(!data)
    {
      res.status(400).json({
        message:"data is missing for encrption"
      })
    }
     const endata = JSON.stringify(data); 
  
      // console.log("under encryption >{{{");
    const cipher = crypto.createCipheriv(ecnryption_method, key, encryptionIV)
    const finaldata= Buffer.from(
      cipher.update(endata, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64') 
    console.log("final encrypted data ___",finaldata);
    return res.status(200).json(finaldata);
    
  } catch (error) {
    console.log("Error ___***",error);
    return res.status(400).json(error);
    
  }
}


function decryptData(req,res,next) {
  try {
    // console.log("inside Decryption ?????");
    const encrypttoken=req.body.encryptedBody;
    if(!encrypttoken){
      return res.status(400).json({
        message:"encrpted data is missing "
      })
    }
    const buff = Buffer.from(encrypttoken, 'base64')
    const decipher = crypto.createDecipheriv(ecnryption_method, key, encryptionIV)
    const finaldata=
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8');
     const parsedata= JSON.parse(finaldata);
  
      console.log("Decrpted Data --> ",parsedata);
      req.body=parsedata;
      // return res.status(200).json(parsedata) 
      next();
  } catch (error) {
    console.log("Error ___***",error);
  }


}

module.exports = {
  encryptData,
  decryptData
};