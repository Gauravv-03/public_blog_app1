const express = require("express");
const router = express.Router();
const { showCreatePost, createPost ,getAllPost,getPostById,deletePost,postUpdate,getMyPost,getPostByIdUpdate,getMyPostView,getMyPostDelete} = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/getMyPost",authMiddleware,getMyPost);


router.post("/createPost", authMiddleware, createPost);
router.get("/getAllPost",getAllPost);

// router.get("/getPostById/:id",getPostById);
router.get("/getPostById",getPostById);

router.delete("/deletePost/:id",authMiddleware,deletePost);

// router.put("/postUpdate/:id",authMiddleware,postUpdate);
router.post("/updatePost",authMiddleware,postUpdate);

// router.get("/updatePostForm",authMiddleware,postUpdate);
router.get("/updatePostForm", authMiddleware, getPostByIdUpdate); 

// router.get('/updatePostForm', authMiddleware, updatePostForm);

// router.get("/dashboard", authMiddleware, (req, res) => {
//   res.render("pages/dashboard", { user: res.locals.user });
// });
router.get("/createPostPage",authMiddleware,(req,res)=>{
    res.render("pages/createPostUi");
})
router.get("/getPostByIdPage",(req,res)=>{
    res.render("pages/getPostByIdPage");
})
//get the post of login user
router.get("/getMyPosts",authMiddleware,getMyPostView);
//get the post of login user for update
router.get("/viewMyPosts",authMiddleware,getMyPost);


router.get("/deletePostView",authMiddleware,getMyPostDelete)
router.post("/deletePost",authMiddleware,deletePost);



module.exports = router;


