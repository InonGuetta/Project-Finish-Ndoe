const express = require("express");
const _ = require("lodash");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/auth");
const joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginSchemaJoi = joi.object({
  email: joi.string().required().min(6).email(),
  password: joi.string().required().min(8),
});

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // joi validate
    const { error } = loginSchemaJoi.validate({ email, password });
    if (error) return res.status(400).send(error.message);

    // check if the user exists
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("user not found");

    bcrypt.compare(password, user.password, function (err, passIsCorrect) {
      if (err) {
        // handle error
        return res.status(400).send("ERROR");
      }
      if (passIsCorrect) {
        // Send JWT
        const genToken = jwt.sign(
          { _id: user._id, biz: user.biz },
          process.env.jwtKey
        );
        // all is ok & give token biz and id
        res.status(200).send({ token: genToken, id: user._id, biz: user.biz });
      } else {
        return res.status(400).send("wrong email or password");
      }
    });
  } catch (error) {
    res.status(400).send("ERROR in login" + error);
  }
});

router.get("/", [auth], async (req, res) => {
  try {
    console.log(req.payload);

    let user = await User.findOne({ _id: req.payload._id });

    res.send({ user });
  } catch (error) {
    res.status(401).send("ERROR in login" + error);
  }
});

module.exports = router;
