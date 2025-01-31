const express = require('express');
const router = express.Router();
const users = require('./controllers/users.js');
const token = require('./token.js');
const { upload, fileUpload } = require('./fileUpload');

router.get("/", (req, res) => {
  res.send({ message: "Welcome to my application." });
});

router.post("/add_user", upload.single('user_image'), users.addUser);

module.exports = router;