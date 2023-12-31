const errorHandler = require("./error");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, "Unauthorized!"));
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Forbidden"));
      }
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyToken };
