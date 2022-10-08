const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const login = require("./routes/login");
const profile = require("./routes/profile");
const register = require("./routes/register");
const card = require("./routes/card");

// const cors = require("cors");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
// app.use(cors());

app.use("/api/card", card);
app.use("/api/login", login);
app.use("/api/profile", profile);
app.use("/api/register", register);

mongoose
  .connect(process.env.dbString, { useNewUrlParser: true })
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log("Server started on port", PORT));
