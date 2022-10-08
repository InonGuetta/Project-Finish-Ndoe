const express = require("express");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const auth = require("../middlewares/auth")

const router = express.Router();

const registerSchemaJoi = joi.object({
  name: joi.string().required().min(2),
  email: joi.string().required().min(6).email(),
  password: joi.string().required().min(8),
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password, biz } = req.body;

    // joi validate
    const { error } = registerSchemaJoi.validate({ name, email, password });
    if (error) return res.status(400).send(error.message);

    //user exist
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already exist");

    //add new user
    user = new User({ name, email, password, biz: false });

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //create token
    const genToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.jwtKey
    );

    await user.save();
    res.status(201).send({ token: genToken, id: user._id, biz: biz });
  } catch (error) {
    res.status(400).send("ERROR in register" + error);
  }
});

module.exports = router;
