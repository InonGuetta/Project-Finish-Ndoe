const express = require("express");
const _ = require("lodash");
const router = express.Router();
const User = require("../models/User");
const Card = require("../models/Card");
const auth = require("../middlewares/auth");

router.get("/my-cards", [auth], async (req, res) => {
  try {
    //find the card of user
    let cards = await Card.find({ User_Id: req.payload._id });

    // show to user the cards
    res.status(201).send({ cards });
  } catch (error) {
    res.status(400).send("ERROR in card" + error);
  }
});

module.exports = router;
