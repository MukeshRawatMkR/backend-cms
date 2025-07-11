// const express = require('express');
// const auth = require('../middlewares/auth');
// const router = express.Router();
// const upload = require('../middlewares/upload');
// router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
//   req.user.avatar = req.file.path;
//   await req.user.save();
//   res.json({ avatar: req.user.avatar });
// });