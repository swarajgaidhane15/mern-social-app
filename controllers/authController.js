const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const { jwt_secret, nodemailer_api } = require('../config/keys');

sgMail.setApiKey(nodemailer_api);

const ValidateEmail = (email) => {
  var emailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (email.match(emailformat)) return true;
  return false;
};

module.exports.home = (req, res) => {
  res.json({ error: false, msg: "No error" });
};

module.exports.signup = (req, res) => {
  const { name, email, password, profile } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: true, msg: "All fields are required" });
  }

  if (!ValidateEmail(email))
    return res.status(400).json({ error: true, msg: "Email is not valid" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ error: true, msg: "Password should be minimum 6 characters" });

  User.findOne({ email }).then((user) => {
    if (user)
      return res.status(400).json({ error: true, msg: "User already exists" });
  });

  const user = new User({
    name,
    email,
    password,
    profile,
  });

  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;

      user.password = hash;

      user
        .save()
        .then((user) => {
          const token = jwt.sign({ id: user._id }, jwt_secret);

          user.password = undefined;

          const msg = {
            to: user.email,
            from: "wandamaximoff1508@gmail.com",
            subject: "Account created",
            html: `<h1>Welcome ${user.name}, to <strong>Socio<em>ty</em></strong></h1><br/><p>Your account has been created successfully 😊️</p>`,
          };

          res.status(200).json({
            error: false,
            msg: "Account created successfully",
            token,
            user,
          });

          // sgMail
          //   .send(msg)
          //   .then(() => {
          //     console.log("Email sent");
          //   })
          //   .catch((error) => {
          //     console.error(error);
          //   });
        })
        .catch((err) =>
          res.status(500).json({ error: true, msg: "Could not create user" })
        );
    });
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, msg: "All fields are required" });
  }

  User.findOne({ email })
    .then(async (user) => {
      if (!user)
        return res
          .status(400)
          .json({ error: true, msg: "Invalid Credentials" });

      await bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res
            .status(400)
            .json({ error: true, msg: "Invalid Credentials" });
      });

      const token = jwt.sign({ id: user._id }, jwt_secret);

      user.password = undefined;

      res.status(200).json({
        error: false,
        token,
        user,
      });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: true, msg: "Could not find user, try again" })
    );
};

module.exports.getUser = (req, res) => {
  if (req.user) {
    res.status(200).json({ error: false, user: req.user });
  } else {
    res
      .status(500)
      .json({ error: true, msg: "User details could not be found" });
  }
};

module.exports.deleteUser = (req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (user) {
      Post.find({ posted_by: user._id })
        .then((posts) => posts.forEach((post) => post.deleteOne()))
        .then(user.deleteOne());

      Post.find().then((posts) =>
        posts.forEach((post) => {
          post.likes = post.likes.filter((id) => id !== user._id);
          post.comments = post.comments.filter(
            (comment) => comment.posted_by !== user._id
          );
        })
      );

      User.find().then((users) =>
        users.forEach((u) => {
          u.followers = u.followers.filter((id) => id !== user._id);
          u.following = u.following.filter((id) => id !== user._id);
        })
      );
    }
  }).then((result) =>
    res.status(200).json({ error: false, msg: "Deleted Successfully" })
  );
};
