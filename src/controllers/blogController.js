module.exports = {
  createBlog: require('./postController'),
  getMyBlogs: require('./getMyBlogs'),
  getAllBlogs: require('./getAllBlogs'),
  getSingleBlog: require('./getSingleBlog'),
  updateBlog: require('./updateBlog'),
  deleteBlog: require('./deleteBlog'),
};

// exports.getAllBlogs = (req, res) => {
//   res.send("All blogs here");
// };
