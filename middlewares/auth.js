const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // get the token FOR......
    let token = req.header("Authorization");
    if (!token) return res.status(401).send("Access denied. no token provided");

    //check the token FOR......
    let payload = jwt.verify(token, process.env.jwtKey);

    // save the payload FOR.....
    req.payload = payload;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
