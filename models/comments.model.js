const db=require("./db");


function addComment(content,postId,userId,callback)
{
    const sql=`insert into comments(content,postId,userId) values (?,?,?)`;
    db.query(sql,[content,postId,userId],callback);
}       

function getAllComments(postId,callback)
{
    const sql=`select comments.id, comments.content, comments.userId,users.fullName as commenter
    from comments
    JOIN users on comments.userId = users.id
    where postId=?
    order by comments.created_at DESC`
    db.query(sql,[postId],callback);
}


function getCommentsById(commentId,callback)
{
    const sql=`select * from comments where id=?`;
    db.query(sql,[commentId],callback);
}


function deleteComment(commentId,userId,callback)
{
    const sql=`DELETE FROM comments where id=? AND userId=?`
    db.query(sql,[commentId,userId],callback);
}

function updateComment(content,commentId,userId,callback)
{
    const sql=`update comments SET content = ? where id= ? AND userId=?`
    db.query(sql,[content,commentId,userId],callback)
}


module.exports={
    addComment,getAllComments,getCommentsById,deleteComment,updateComment

}