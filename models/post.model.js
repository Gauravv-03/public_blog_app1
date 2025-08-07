const db = require("./db");

function createPost(title, content, authorId, callback) {
  // const sql = "INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)";
  const sql=`CALL Addposts(?,?,?)`; // we are using store procedure here . insert query store in mysql worbench(databse)
  db.query(sql, [title, content, authorId], callback);
}

// by default mysql consider join as inner join if we do not specify
function getAllPosts(callback) {
  const sql = `
    SELECT posts.id, title, content, created_at, users.fullName AS authorName
    FROM posts
    JOIN users ON posts.authorId = users.id
    ORDER BY posts.created_at DESC`;
  db.query(sql, callback);
}

function getPostById(postId, callback) {
  const sql = `
    SELECT posts.id, posts.title, posts.content, posts.created_at, posts.authorId, users.fullName AS authorName
    FROM posts
    JOIN users ON posts.authorId = users.id
    WHERE posts.id = ?`;
  db.query(sql, [postId], callback);
}


 function getMyPost(myId,callback)
 {
  const sql=`select posts.id , posts.title,  posts.content, posts.created_at,posts.authorId, users.fullName as authorName 
  from posts
  JOIN users 
  on posts.authorId  = users.id 
  where posts.authorId=?`;
  db.query(sql,[myId],callback);
 }



function deletePost(postId, callback) {
  const sql = "DELETE FROM posts WHERE id = ?";
  db.query(sql, [postId], callback);
}



 function postUpdate(postid,title,content,callback)
 {
  const sql= "update posts Set title= ? , content = ?  where id = ?"
  db.query(sql,[title,content,postid],callback);
 }


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  postUpdate,getMyPost
};
