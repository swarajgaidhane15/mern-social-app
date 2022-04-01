const express = require("express");
const router = express.Router();

const {
  home,
  signup,
  login,
  getUser,
  deleteUser,
} = require("../controllers/authController");

const auth = require("../middlewares/authCheck");

router.get("/", home);
router.post("/signup", signup);
router.post("/login", login);
router.get("/user", auth, getUser);
router.delete("/delete", auth, deleteUser);

module.exports = router;
