const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().allow('')
});

exports.validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};