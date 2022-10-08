const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../middlewares/auth");
const joi = require("joi");
const User = require("../models/User");
const Card = require("../models/Card");

const cardSchemaJoi = joi.object({
  Business_Name: joi.string().required().min(2),
  Business_Description: joi.string().required().min(2).max(255),
  Business_Adress: joi.string().required(),
  Business_Phone: joi.string().required(),
  Business_Image: joi.string().required(),
});

router.post("/", [auth], async (req, res) => {
  try {
    const {
      Business_Name,
      Business_Description,
      Business_Adress,
      Business_Phone,
      Business_Image,
    } = req.body;

    // joi validate
    const { error } = cardSchemaJoi.validate({
      Business_Name,
      Business_Description,
      Business_Adress,
      Business_Phone,
      Business_Image,
    });
    if (error) return res.status(400).send(error.message);

    // create random number to the card
    let random_Id = _.random(10000000);
    let crd = await Card.findOne({ random_Id });

    // if exist create again until not found
    while (crd) {
      random_Id = _.random(10000000);
      crd = await Card.findOne({ random_Id });
    }

    //add new card
    let newCard = new Card({
      Business_Name,
      Business_Description,
      Business_Adress,
      Business_Phone,
      Business_Image,
      random_Id,
      User_Id: req.payload._id,
    });

    await newCard.save();

    res.status(201).send({ card: newCard });
  } catch (err) {
    res.status(400).send("ERROR in card" + error);
  }
});

router.get("/", [auth], async (req, res) => {
  try {
    const { card_id: random_Id } = req.body;

    let card = await Card.findOne({ random_Id });

    res.status(201).send({ card });
  } catch (err) {
    res.status(400).send("ERROR in card" + error);
  }
});

router.get("/all-cards", [auth], async (req, res) => {
  try {
    let cards = await Card.find();

    res.status(201).send({ cards });
  } catch (err) {
    res.status(400).send("ERROR in card" + error);
  }
});

router.put("/", [auth], async (req, res) => {
  try {
    const {
      Business_Name,
      Business_Description,
      Business_Adress,
      Business_Phone,
      Business_Image,
      card_id: random_Id,
    } = req.body;

    let newData = {};

    if (Business_Name) newData.Business_Name = Business_Name;
    if (Business_Description)
      newData.Business_Description = Business_Description;
    if (Business_Adress) newData.Business_Adress = Business_Adress;
    if (Business_Phone) newData.Business_Phone = Business_Phone;
    if (Business_Image) newData.Business_Image = Business_Image;

    let card = await Card.findOne({ random_Id });
    let updated = await Card.findOneAndUpdate(random_Id, newData, {
      new: true,
    });

    res.status(201).send({ updated });
  } catch (err) {
    res.status(400).send("ERROR in card" + error);
  }
});

// צריך לבדוק
router.delete("/", [auth], (req, res) => {
  try {
    const { card_id: random_Id } = req.body;

    Card.findOneAndRemove({ random_Id }, function (err, doc) {
      if (err) {
        res.status(400).send("ERROR in card" + err);
      } else {
        res.status(201).send({ removed: doc });
      }
    });
  } catch (err) {
    res.status(400).send("ERROR in card" + error);
  }
});

module.exports = router;
