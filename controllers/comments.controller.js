const commentController = require("../models/comments.model");

function addComment(req, res) {
try {
    // console.log(" Post ID:", req.params.id);
    // console.log(" req.body:", req.body);
    // if (!req.body) {
    //     return res.status(400).json({ message: "req.body is undefined. Check express.json()" });
    // }
    // console.log("",req.body);
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    commentController.addComment(content, postId, userId, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "error in add comments",
          message: err.message,
        });
      }
      res.status(200).json({
        message: "comments successfullly added",
      });
    });
} catch (error) {
    console.log("error-- >>",error)
  
}

  
}

function getAllComments(req, res) {

 try {
   const postId = req.params.id;
 
  //  console.log("postid", postId);
 
   commentController.getAllComments(postId, (err, result) => {
     if (err) {
      //  console.log(" SQL Error:", err.message);
       return res.status(400).json({
         message: "can not get all comment ",
       });
     }
     res.status(200).json(result);
   });
   
 } catch (error) {
    console.log("error-- >>",error)
  
 }
}

function getCommentsById(req, res) {

try {
    const commentId = req.params.id;
    commentController.getCommentsById(commentId, (err, result) => {
      if (err) {
        return res.status(400).json({
          message: "Error in get comment by id",
        });
      }
  
      console.log("result++++++", result);
      res.status(200).json(result);
    });
  
} catch (error) {
    console.log("error-- >>",error)
  
}
}

function deleteComment(req, res) {
try {
  
    const userId = req.user.id;
    const commentId = req.params.id;
  
    commentController.getCommentsById(commentId, (err, result) => {
      if (err) {
        return res.status(200).json({
          message: "error in getcomment by id in delete comment part",
        });
      }
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }
      const comment = result[0];
  
      const commentUserId = comment.userId;
  
      if (userId !== commentUserId) {
        return res.status(400).json({
          message:
            "unautorised user to delete the comment ..userid and comment userid is not matching",
        });
      }
  
      commentController.deleteComment(commentId, userId, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "error in deletion of comment" });
        }
        res.status(200).json({
          message: "comment deletedd successssfullyy",
        });
      });
    });
} catch (error) {
    console.log("error-- >>",error)
  
}

}

function updateComment(req, res) {
  try {
    const { content } = req.body;
    const commentId = req.params.id;
    commentController.getCommentsById(commentId, (err, result) => {
      if (err) {
        return res.status(400).json({
          message: "error aa gyi get comoment by id >>. inside update comment ",
        });
      }
      const comment = result[0];
      const commentUserId = comment.userId;
      const userIdd = req.user.id;

      console.log("commentuser ki Id >>", commentUserId);
      console.log("User ki Id >>", userIdd);

      if (commentUserId !== userIdd) {
        return res.status(400).json({
          message:
            "comment userid and loginuser id not matching ..can not update",
        });
      }
      // now we can update
      commentController.updateComment(
        content,
        commentId,
        userIdd,
        (err) => {
          if (err) {
            return res.status(400).json({
              
              message: "error aa gyi cmment update krne me",
              message:err.message
            });
          }
          res.status(200).json({
            message: "Post updated Successfully",
          });
        }
      );
    });
  } catch (error) {
    console.log("eerr", error);
  }
}
module.exports = {
  addComment,
  getAllComments,
  deleteComment,
  getCommentsById,
  updateComment,
};
