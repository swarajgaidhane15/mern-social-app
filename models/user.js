const mongoose = require("mongoose");
const Post = require("./post");
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a valid password"],
    minlength: [6, "Minimum password length is 6"],
  },
  profile: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1485423036251-8b2a2909899f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHBvcnRyYWl0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  register_date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("deleteOne", function (next) {
  Post.find({ posted_by: this._id }).then((posts) => {
    Promise.all(posts.forEach((post) => post.deleteOne())).then(next());
  });
});

module.exports = User = mongoose.model("User", UserSchema);
