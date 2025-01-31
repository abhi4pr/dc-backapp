const jwt = require("jsonwebtoken");
const vari = require('./variables.js');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.status(401).send({
         status: 401,
         message: "Not authorized"
      });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, vari.JWT_TOKEN, (err, payload) =>{
      if (err) {
        res.status(403).send({
           status: 498,
           message: "Token is invalid"
        });
      } else {
        req.payload = payload;
        next();
      }
    })
};

module.exports = {
    verifyToken
}