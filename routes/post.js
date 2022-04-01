const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  createPost,
  getMyPost,
  likePost,
  dislikePost,
  comment,
  deletePost,
  getFollowedPost,
} = require("../controllers/postController");

const auth = require("../middlewares/authCheck");

router.get("", auth, getAllPosts);
router.post("", auth, createPost);
router.delete("/:postId", auth, deletePost);
router.put("/like", auth, likePost);
router.put("/dislike", auth, dislikePost);
router.put("/comment", auth, comment);
router.get("/myposts", auth, getMyPost);
router.get("/getFollowedPost", auth, getFollowedPost);

module.exports = router;
