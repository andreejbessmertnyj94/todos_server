const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TaskSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "The task should not be empty."],
      maxlength: [120, "The maximum allowed length is 120 characters."],
    },
    completed: { type: Boolean, default: false },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Task", TaskSchema);
