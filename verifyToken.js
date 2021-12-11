const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.json("We need a token which is not currently provided");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Authentication failed" });
      } else {
        req.decodedUserId = decoded.id;
        next();
      }
    });
  }
}

module.exports = verifyToken;
