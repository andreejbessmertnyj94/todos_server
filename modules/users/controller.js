const { User, UserValidator, Token } = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

async function generateAuthToken(user) {
  // Generate an auth token for the user
  await new Promise((r) => setTimeout(r, 500));

  const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: '30d',
  });

  await Token.create({ value: token, UserId: user.id });

  return token;
}

async function findByCredentials(username, password) {
  // Search for a user by username and password.
  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (!user) {
    throw {
      name: 'AuthorizationError',
      message: 'User does not exist',
    };
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw {
      name: 'AuthorizationError',
      message: 'Wrong password',
    };
  }

  return user;
}

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    await UserValidator.validateAsync({ username, password });
    await User.create({ username, password });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      err.message = 'This username is already taken';
    }
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    await UserValidator.validateAsync({ username, password });

    const user = await findByCredentials(username, password);
    const token = await generateAuthToken(user);

    res.json({ message: 'Login successful', data: { token } });
  } catch (err) {
    return next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await req.token.destroy();

    res.json({
      message: 'Logout successful',
      data: { token: req.token.value },
    });
  } catch (err) {
    return next(err);
  }
};

exports.logoutOthers = async (req, res, next) => {
  try {
    await Token.destroy({
      where: {
        UserId: req.token.UserId,
        [Op.not]: { id: req.token.id },
      },
    });

    res.json({ message: 'Logout from others successful' });
  } catch (err) {
    return next(err);
  }
};
