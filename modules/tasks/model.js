const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TaskSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Empty task.'],
      maxlength: [120, "The maximum allowed length is 120 characters."],
    },
    completed: { type: Boolean, default: false },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Task", TaskSchema);
