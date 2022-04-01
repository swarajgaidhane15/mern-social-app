const express = require("express");
const router = express.Router();

const {
  getUserDetails,
  follow,
  unfollow,
  update,
} = require("../controllers/userController");

const auth = require("../middlewares/authCheck");

router.get("/:id", auth, getUserDetails);
router.put("/follow", auth, follow);
router.put("/unfollow", auth, unfollow);
router.put("/update", auth, update);

module.exports = router;
