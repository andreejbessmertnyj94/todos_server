const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'The task should not be empty.'],
      maxlength: [120, 'The maximum allowed length is 120 characters.'],
    },
    completed: { type: Boolean, default: false },
    user_id: {
      type: mongoose.ObjectId,
      required: [true, 'The task must have an owner.'],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Task', TaskSchema);
