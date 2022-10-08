const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  Business_Name: {
    type: String,
    required: true,
    minlength: 2,
  },
  Business_Description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  Business_Adress: {
    type: String,
    required: true,
  },
  Business_Phone: {
    type: String,
    required: true,
  },
  Business_Image: {
    type: String,
    required: true,
  },
  random_Id: {
    type: Number,
    required: true,
  },
  User_Id: {
    type: String,
    required: true,
  },
});

const Card = mongoose.model("card", CardSchema);
module.exports = Card;
