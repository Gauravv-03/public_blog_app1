const express=require("express");
const router=express.Router();

const {addComment,getAllComments,getCommentsById,deleteComment,updateComment} = require("../controllers/comments.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/addComment/postNo/:id",authMiddleware, addComment);
router.get("/getAllComments/post/:id",getAllComments);
router.get("/getCommentsById/commentId/:id",getCommentsById);
router.delete("/deleteComment/comment_id/:id",authMiddleware,deleteComment);

router.put("/updateComment/comment_id/:id",authMiddleware,updateComment);
module.exports=router;


