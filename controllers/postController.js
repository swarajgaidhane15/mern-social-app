const Post = require("../models/post");

module.exports.getAllPosts = (req, res) => {
  Post.find()
    .sort("-date_created")
    .populate("posted_by", "-password")
    .populate("comments.posted_by", "-password")
    .then((posts) => {
      res.status(200).json({ error: false, posts: posts });
    })
    .catch((err) => {
      res.status(500).json({ error: true, msg: "Could not get posts" });
    });
};

module.exports.createPost = (req, res) => {
  const { title, body, imageUrl } = req.body;

  if (!title || !body) {
    return res
      .status(400)
      .json({ error: true, msg: "All fields are required" });
  }

  const post = new Post({
    title,
    body,
    photo: imageUrl,
    posted_by: req.user,
  });

  post
    .save()
    .then((post) => {
      res.status(200).json({ error: false, post: post });
    })
    .catch((err) => {
      res.status(200).json({ error: true, msg: "Failed to post" });
    });
};

module.exports.getMyPost = (req, res) => {
  Post.find({ posted_by: req.user._id })
    .sort("-date_created")
    .populate("posted_by", "-password")
    .populate("comments.posted_by", "-password")
    .then((posts) => {
      res.status(200).json({ error: false, posts: posts });
    })
    .catch((err) =>
      res.status(400).json({ error: true, msg: "No posts found" })
    );
};

module.exports.getFollowedPost = (req, res) => {
  Post.find({ posted_by: { $in: req.user.following } })
    .sort("-date_created")
    .populate("posted_by", "-password")
    .populate("comments.posted_by", "-password")
    .then((posts) => {
      res.status(200).json({ error: false, posts: posts });
    })
    .catch((err) => {
      res.status(500).json({ error: true, msg: "Could not get posts" });
    });
};

module.exports.likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  ).exec((err, result) => {
    if (err)
      return res.status(400).json({ error: true, msg: "Could not like" });

    return res
      .status(200)
      .json({ error: false, msg: "Liked successfully", result });
  });
};

module.exports.dislikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  ).exec((err, result) => {
    if (err)
      return res.status(400).json({ error: true, msg: "Could not dislike" });

    return res
      .status(200)
      .json({ error: false, msg: "Disliked successfully", result });
  });
};

module.exports.comment = (req, res) => {
  const comment = {
    text: req.body.text,
    posted_by: req.user._id,
  };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.posted_by", "-password")
    .populate("posted_by", "-password")
    .exec((err, result) => {
      if (err)
        return res
          .status(400)
          .json({ error: true, msg: "Could not add comment" });

      return res
        .status(200)
        .json({ error: false, msg: "Comment added successfully", result });
    });
};

module.exports.deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("posted_by", "-password")
    .exec((err, post) => {
      if (err)
        return res.status(400).json({ error: true, msg: "Could not delete" });

      if (post.posted_by._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res
              .status(200)
              .json({ error: false, msg: "Post deleted successfully" });
          })
          .catch((err) =>
            res.status(400).json({ error: true, msg: "Could not delete" })
          );
      }
    });
};
