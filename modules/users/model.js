const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'The username field must not be empty.'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'The password field must not be empty.'],
      minlength: [7, 'The minimum allowed password length is 7 characters.'],
    },
    tokens: {
      type: Array,
    },
  },
  { versionKey: false }
);

UserSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
