const { DataTypes } = require('sequelize');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const sequelize = require('../../middleware/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', bcrypt.hashSync(value, 8));
    },
  },
});

const UserValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.empty': 'The username field must not be empty.',
    'string.alphanum':
      'The username field must only contain alpha-numeric characters.',
    'string.min': 'The username field should have a minimum length of {#limit}',
    'string.max': 'The username field should have a maximum length of {#limit}',
    'any.required': 'The username is a required field',
  }),
  password: Joi.string().min(7).max(30).required().messages({
    'string.empty': 'The password field must not be empty.',
    'string.min': 'The password field should have a minimum length of {#limit}',
    'string.max': 'The password field should have a maximum length of {#limit}',
    'any.required': 'The password is a required field',
  }),
});

const Token = sequelize.define('Token', {
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Token, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Token.belongsTo(User);

module.exports = { Token, User, UserValidator };
