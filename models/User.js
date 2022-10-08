const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  biz: {
    type: Boolean,
    required: true,
  },
});
//open collection in db
const User = mongoose.model("user", UserSchema);

module.exports = User;
