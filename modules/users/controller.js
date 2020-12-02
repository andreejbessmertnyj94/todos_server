const User = require("./model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function generateAuthToken(user) {
  // Generate an auth token for the user
  await new Promise((r) => setTimeout(r, 500));
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
  user.tokens.push({ value: token });
  await user.save();
  return token;
}

async function findByCredentials(username, password) {
  // Search for a user by username and password.
  const user = await User.findOne({ username });
  if (!user) {
    throw {
      name: "AuthorisationError",
      message: "User does not exist",
    };
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw {
      name: "AuthorisationError",
      message: "Wrong password",
    };
  }
  return user;
}

exports.register = async (req, res, next) => {
  try {
    await User.create(req.body);
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await findByCredentials(username, password);
    const token = await generateAuthToken(user);
    res.json({ message: "Login successful", data: { token } });
  } catch (err) {
    return next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.value !== req.token;
    });
    await req.user.save();
    res.json({ message: "Logout successful", data: { token: req.token } });
  } catch (err) {
    return next(err);
  }
};

exports.logoutOthers = async (req, res, next) => {
  try {
    req.user.tokens = { value: req.token };
    await req.user.save();
    res.json({ message: "Logout from others successful" });
  } catch (err) {
    return next(err);
  }
};
