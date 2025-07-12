const express = require("express");
const {
  createBlog, getMyBlogs, getAllBlogs,
  getSingleBlog, updateBlog, deleteBlog
} = require("../controllers/blogController");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createBlog).get(getAllBlogs);
router.route("/my").get(protect, getMyBlogs);
router.route("/:id")
  .get(getSingleBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
