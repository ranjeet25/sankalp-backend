
const express = require("express");
const router = express.Router();
const user_registration = require("../Model/register")

router.post("/register", (req, res) => {
    user_registration.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username },
        { uid: req.body.uid },
      ],
    }).then((data) => {
      if (data == null) {
        user_registration.create({
          role: req.body.role,
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: req.body.pass,
          uid: req.body.uid,
        }).catch((err) => console.log(err));
        res.status(200).json({ msg: "User Created sucessfully" });
      } else {
        res.status(300).json({ msg: "User already exits" });
      }
    });
    
  });

  module.exports = router;