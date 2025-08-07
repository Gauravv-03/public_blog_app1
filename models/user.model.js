const connection=require("./db");


function createUser(fullName, email,hashedPassword,phoneNO,callback)
{
    const sql="insert into users(fullName, email,password,phoneNo) values (?,?,?,?)";

    connection.query(sql,[fullName,email,hashedPassword,phoneNO],callback);
}

function findByEmail(email,callback)
{
    const sql="select *from users where email=?"
    connection.query(sql,[email],callback);
}

function findById(id,callback)
{
    const sql="select *from users where id=?"
    connection.query(sql,[id],callback);
}

module.exports={
    findByEmail,findById,createUser
};