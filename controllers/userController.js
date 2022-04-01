const Post = require("../models/post");
const User = require("../models/user");

module.exports.getUserDetails = (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ posted_by: req.params.id }).then((posts) =>
        res.status(200).json({ error: false, user, posts })
      );
    })
    .catch((err) => {
      res.status(500).json({ error: true, msg: "Could not find user" });
    });
};

module.exports.follow = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err)
        return res
          .status(400)
          .json({ error: true, msg: "Could not add to followers" });

      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) =>
          res.status(200).json({ error: false, msg: "Followed", result })
        )
        .catch((err) =>
          res
            .status(400)
            .json({ error: true, msg: "Could not add to following" })
        );
    }
  );
};

module.exports.unfollow = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err)
        return res
          .status(400)
          .json({ error: true, msg: "Could not remove from followers" });

      User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.body.followId },
      })
        .select("-password")
        .then((result) =>
          res.status(200).json({ error: false, msg: "Unfollowed", result })
        )
        .catch((err) =>
          res
            .status(400)
            .json({ error: true, msg: "Could not remove from following" })
        );
    }
  );
};

module.exports.update = (req, res) => {
  const { name, email, bio, url } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
        email,
        bio,
        profile: url,
      },
    },
    { new: true },
    (err, result) => {
      if (err)
        return res
          .status(400)
          .json({ error: true, msg: "Could not update profile " });
      res.status(200).json({ error: false, msg: "Profile updated", result });
    }
  );
};
