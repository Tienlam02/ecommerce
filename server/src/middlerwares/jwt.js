const jwt = require("jsonwebtoken");

const generateAccsessToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "2d" });

const generateRefreshAccsessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const verifyAccessToken = (req, res, next) => {
  // tương đương với việc kiểm tra login hay chưa
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: 0,
          mess: "Token invalid or Expiresin",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: 0,
      mess: "Required authentication",
    });
  }
};

const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role == 0)
    res.status(401).json({
      success: 0,
      mess: "Require role admin",
    });
  next();
};
module.exports = {
  generateAccsessToken,
  generateRefreshAccsessToken,
  verifyAccessToken,
  isAdmin,
};
