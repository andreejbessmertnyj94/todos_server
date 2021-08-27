const { DataTypes } = require('sequelize');
const Joi = require('joi');

const sequelize = require('../../middleware/db');
const { User } = require('../users/model');

const Task = sequelize.define('Task', {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

const TaskValidator = Joi.object({
  content: Joi.string().min(3).max(120).required().messages({
    'string.empty': 'The task should not be empty.',
    'string.min': 'The minimum allowed length is {#limit} characters.',
    'string.max': 'The maximum allowed length is {#limit} characters.',
    'any.required': 'The content is a required field',
  }),
  completed: Joi.boolean(),
});

User.hasMany(Task, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Task.belongsTo(User);

module.exports = { Task, TaskValidator };
