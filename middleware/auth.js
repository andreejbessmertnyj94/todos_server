const jwt = require("jsonwebtoken");
const User = require("../modules/users/model");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (token == null)
      throw {
        name: "UnauthorizedError",
        message:
          "Attempt to access without the token, or an incorrect token format.",
      };
    const data = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ _id: data._id, "tokens.value": token });
    if (!user) {
      throw {
        name: "UnauthorizedError",
        message: "User not found",
      };
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = authenticateToken;
