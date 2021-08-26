const jwt = require('jsonwebtoken');
const { Token } = require('../modules/users/model');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    if (!token) {
      throw {
        name: 'UnauthorizedError',
        message:
          'Attempt to access without the token, or an incorrect token format.',
      };
    }

    const data = jwt.verify(token, process.env.JWT_KEY);

    const dbToken = await Token.findOne({
      where: {
        UserId: data.id,
        value: token,
      },
    });

    if (!dbToken) {
      throw {
        name: 'UnauthorizedError',
        message: 'User from token or token not found',
      };
    }

    req.token = dbToken;

    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = authenticateToken;
