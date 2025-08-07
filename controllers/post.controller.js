const postModel = require("../models/post.model");
const { post } = require("../routes/post.routes");

function showCreatePost(req, res) {
  res.render("createPost", { error: null, message: null });
}

function createPost(req, res) {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;
    if (!title || !content) {
      return res.status(400).json({
        message: "title and content needed ----",
      });
    }
    postModel.createPost(title, content, authorId, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "post creation failed hogya",
        });
      }
      res.status(200).json({
        message: "Post created successfully",
        postId: result.insertId,
      });
    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

function getAllPost(req, res) {
  try {
    postModel.getAllPosts((err, result) => {
      if (err) {
        return res.status(401).json({
          message: "error in get all post .. unavaible to get all post",
        });
      }
      // res.status(200).json(result)
      res.render("pages/viewAllPosts", {
        posts: result,
      });
    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

function getPostById(req, res) {
  console.log("inside get post by id contorller ____+++");
  try {
    // const postId=req.params.id;
    const postId = req.query.id;

    console.log("PostId +++++", postId);

    postModel.getPostById(postId, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "error in get post by id",
        });
      }
      console.log("current id +++", result);
      if (result.length === 0) {
        // No post found
        //   return res.render("pages/idPost", { message: "Post not found!" });
        return res.json({
          message: "Post not found",
        });
      }
      res.render("pages/idPost", {
        posts: result,
      });
      // res.status(201).json(result);
    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

function deletePost(req, res) {
  try {
    const postId = req.query.id;
    // console.log("   req.query.id;00987898",req.query.id);
    console.log("deleted Post Id--------->>",postId);
    // if(postId!==req.user.id){
    //     return res.status(401).json({
    //         message:"can't delete post by unauthorised user"
    //     })
    // }
    postModel.deletePost(postId, (err) => {
      if (err) {
        return res.status(500).json({
          message: "unable to delete the post ",
        });
      }
      res.json({ message: "Post deleted" });
    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

function postUpdate(req, res) {
  try {
    const postId = req.query.id;
    console.log("req.params.id",req.params.id);
    console.log("req.body.id",req.body.id);
    console.log("req.query.id",req.query.id);

    console.log("printing postId ===******",postId);
    // get the post first

    postModel.getPostById(postId, (err, result) => {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
      }
      if (err || result.length === 0) {
        return res.status(401).json({
          message: "Error in post update. getpostby id",
        });
      }
      const post = result[0]; //  result will be store in array

      // step 2 .... now check the user authorization
      console.log("req.user.id:", req.user.id);
      console.log("post.authorId:", post.authorId);

      if (post.authorId !== req.user.id) {
        return res.status(401).json({
          message: "you are unautorised and can not update this post",
        });
      }

      // now you are authorise , now you can update the post
      postModel.postUpdate(postId, title, content, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "post update have failed ",
          });
        }
        res.status(201).json({
          message: "post updated ",
          // message:result.authorId
        });
      });
    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

function getPostByIdUpdate(req, res) {
  console.log("inside get post by by Id UPdate ____+++");
  try {
    // const postId=req.params.id;
    const postId = req.query.id;

    console.log("PostId +++++", postId);

    postModel.getPostById(postId, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "error in get post by id",
        });
      }
      console.log("current id +++", result);
      if (result.length === 0) {
        // No post found
        //   return res.render("pages/idPost", { message: "Post not found!" });
        return res.json({
          message: "Post not found",
        });
      }
      console.log("POst infomation &&&",result);
      res.render("pages/updatePostForm", {
        posts: result,
      });
      // res.status(201).json(result);
    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

function getMyPostView(req, res) {
  try {
    const myId = req.user.id;
    // const myId = req.user.id;
    // console.log("Decoded user from token:", req.user);
    //   console.log(" myId:", myId);
    // console.log(" myId from token:", myId);

    postModel.getMyPost(myId, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "error in getmyPost ",
        });
      }

      // console.log("Posts found:", result);

      // res.status(200).json(result);

      res.render("pages/viewMyPosts", {
        posts: result,
        user: req.user,
      });
    
  //  res.render("pages/myPostUpdate", {
  //      posts: result,
  //       user: req.user,
  //    });

    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

function getMyPost(req, res) {
  try {
    const myId = req.user.id;
    // const myId = req.user.id;
    // console.log("Decoded user from token:", req.user);
    //   console.log(" myId:", myId);
    // console.log(" myId from token:", myId);

    postModel.getMyPost(myId, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "error in getmyPost ",
        });
      }

      // console.log("Posts found:", result);

      // res.status(200).json(result);

    //   res.render("pages/viewMyPosts", {
    //     posts: result,
    //     user: req.user,
    //   });
    
   res.render("pages/myPostUpdate", {
       posts: result,
        user: req.user,
     });

    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

function getMyPostDelete(req, res) {
  try {
    const myId = req.user.id;
    // const myId = req.user.id;
    // console.log("Decoded user from token:", req.user);
    //   console.log(" myId:", myId);
    // console.log(" myId from token:", myId);

    postModel.getMyPost(myId, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "error in getmyPost ",
        });
      }

      // console.log("Posts found:", result);

      // res.status(200).json(result);

    //   res.render("pages/viewMyPosts", {
    //     posts: result,
    //     user: req.user,
    //   });
    
   res.render("pages/myPostDelete", {
       posts: result,
        user: req.user,
     });

    });
  } catch (error) {
    console.log("error-- >>", error);
  }
}

module.exports = {
  createPost,
  getAllPost,
  getPostById,
  deletePost,
  postUpdate,
  getMyPost,
  showCreatePost,
  getPostByIdUpdate,getMyPostView,getMyPostDelete
};
