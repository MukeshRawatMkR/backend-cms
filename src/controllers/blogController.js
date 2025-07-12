const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const blog = await Blog.create({ title, content, author: req.user.id });
  res.status(201).json(blog);
};

exports.getMyBlogs = async (req, res) => {
  const blogs = await Blog.find({ author: req.user.id });
  res.json(blogs);
};

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().populate("author", "name");
  res.json(blogs);
};

exports.getSingleBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.user.id)
    return res.status(401).json({ message: "Not authorized" });

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;
  await blog.save();
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.user.id)
    return res.status(401).json({ message: "Not authorized" });

  await blog.remove();
  res.json({ message: "Blog deleted" });
};
